import { ENV_CONFIG } from "$lib/const";

export interface TokenStake {
  id: string;
  user: string;
  amount: string;
  startTime: string;
}

export interface TokenUnstake {
  id: string;
  user: string;
  amount: string;
  blockNumber: string;
}

export interface GraphQLData {
  tokensStakeds: TokenStake[];
  tokensUnstakeds: TokenUnstake[];
}

// *********************************************************************************
// *********************************************************************************

/**
 * Make a POST request to your backend GraphQL proxy.
 * @param {string} query - GraphQL query string
 * @param {object} variables - Variables for the query (optional)
 * @param {string} operationName - Operation name (optional)
 * @returns {Promise<object>} - The result from your backend (deserialized JSON)
 */
export async function fetchStakingGraph({ query = '', variables = {}, operationName = 'Subgraphs' }) {
  const endpoint = `${ENV_CONFIG.VITE_DF_BASE_URL}/subgraph/staking`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query,
            variables,
            operationName,
            environment: 'stage'
        })
    });
    if (!response.ok) {
        // Optionally surface error details
        const errorText = await response.text();
        throw new Error(`Error fetching staking data: ${response.status} ${errorText}`);
    }
    return response.json();
}
