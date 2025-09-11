import { httpAiAgent, type ApiResponse } from "../lib/http/http";

// export async function login() {
//   const response = await fetch('https://sui-private-social-lens-ai-agent.happyfield-d4613d37.eastus.azurecontainerapps.io/api/v1/auth/email/login', {
//     method: 'POST',
//     headers: {
//       'accept': 'application/json',
//       'x-custom-lang': 'en',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email, password })
//   });
//   if (!response.ok) throw new Error('Login failed');
//   const data = await response.json();
//   // Store JWT (token) in localStorage/sessionStorage as needed
//   localStorage.setItem('jwt', data.token);
//   return data.token;
// }

export interface IEmailLoginResponse {
  token: string,
  refreshToken: string,
}

export async function login(email: string, password: string) {
    try {
        const response: ApiResponse<IEmailLoginResponse> = await httpAiAgent.post(`/auth/email/login`, { email, password });

        localStorage.setItem('jwt', response.data.token);
        return response.data.token;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

export async function logout() {
    try {
        const jwt = localStorage.getItem('jwt');
        const sessionId = localStorage.getItem('sessionId');
        const response: ApiResponse<IEmailLoginResponse> = await httpAiAgent.post(
            `/auth/logout`,
            { user: { sessionId }},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );

        localStorage.removeItem('jwt');
        return response.data.token;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}