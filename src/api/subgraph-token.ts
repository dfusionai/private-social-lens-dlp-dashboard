import { ENV_CONFIG } from "$lib/const";

export async function fetchTokenGraph({ query = '', variables = {}, operationName = 'Subgraphs' }) {
  const endpoint = `${ENV_CONFIG.VITE_DF_BASE_URL}/api/subgraph/token`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query,
            variables,
            operationName
        })
    });
    if (!response.ok) {
        // Optionally surface error details
        const errorText = await response.text();
        throw new Error(`Error fetching token data: ${response.status} ${errorText}`);
    }
    return response.json();
}