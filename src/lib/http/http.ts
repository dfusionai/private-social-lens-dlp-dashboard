import { ENV_CONFIG } from "$lib/const";

export interface ApiResponse<T> {
    data: T;
    status: number;
    ok: boolean;    
}

interface HttpError extends Error {
    status?: number;
    cause?: any;
}

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
    timeout?: number;
    retries?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRIES = 1;
const BASE_URL = ENV_CONFIG.VITE_DF_BASE_URL;

// util funcs
const buildUrl = (path: string): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${cleanBase}${cleanPath}`;
};

const createHttpError = (message: string, status?: number, cause?: any): HttpError => {
    const error = new Error(message) as HttpError;
    error.status = status;
    error.cause = cause;
    return error;
};

const createAbortController = (timeout: number): AbortController => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
};

// Main fetch function
export async function fetchDirect<T>(
    path: string, 
    options: RequestInit & RequestOptions = {}
): Promise<ApiResponse<T>> {
    const {
        timeout = DEFAULT_TIMEOUT,
        retries = DEFAULT_RETRIES,
        headers: customHeaders,
        ...fetchOptions
    } = options;

    const url = buildUrl(path);

    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    let lastError: HttpError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = createAbortController(timeout);
            
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                signal: controller.signal,
            });

            // Handle HTTP errors
            if (!response.ok) {
                let errorData = null;
                try {
                    errorData = await response.json();
                } catch {
                    // Ignore JSON parsing errors for error responses
                }

                throw createHttpError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    errorData
                );
            }

            // Parse response
            let data: T;
            const contentType = response.headers.get('content-type');
            
            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text() as T;
            }

            return {
                data,
                status: response.status,
                ok: response.ok,
            };
        } catch (error) {
            lastError = error as HttpError;
            
            // Don't retry on client errors (4xx) or if it's the last attempt
            if (lastError.status && lastError.status >= 400 && lastError.status < 500) {
                break;
            }
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    throw lastError!;
}

export const http = {
    get: <T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> =>
        fetchDirect<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> =>
        fetchDirect<T>(path, { 
            ...options, 
            method: 'POST', 
            body: JSON.stringify(body) 
        }),
    put: <T>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> =>
        fetchDirect<T>(path, { 
            ...options, 
            method: 'PUT', 
            body: JSON.stringify(body) 
        }),
    patch: <T>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> =>
        fetchDirect<T>(path, { 
            ...options, 
            method: 'PATCH', 
            body: JSON.stringify(body) 
        }),
    delete: <T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> =>
        fetchDirect<T>(path, { ...options, method: 'DELETE' }),
};
