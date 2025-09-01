const rpcUrl = import.meta.env.VITE_RPC_URL;

export function padHex(hex) {
    return hex.replace(/^0x/, "").padStart(64, "0");
}

export async function callRpc(method, params) {
    const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
    });
    const { result, error } = await res.json();
    if (error) throw new Error(error.message);
    return result;
}

export function formatNumber(n) {
    return n.toLocaleString("en-US");
}
