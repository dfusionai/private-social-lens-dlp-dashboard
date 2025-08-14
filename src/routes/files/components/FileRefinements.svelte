<script>
    import { callRpc, padHex } from "../util/utils";

    const DLP_ADDRESS = import.meta.env.VITE_DLP_ADDRESS;
    const DATA_REGISTRY_ADDRESS = import.meta.env.VITE_DATA_REGISTRY_ADDRESS;

    let { fileCountNumber } = $props();

    let fileList = $state([]);

    async function fetchFileIdsList() {
        try {
            const listPromises = [];
            console.log("fileCountNumber", fileCountNumber);
            for (let i = fileCountNumber - 1; i >= fileCountNumber - 5; i--) {
                console.log("i", i);
                listPromises.push(
                    callRpc("eth_call", [
                        { to: DLP_ADDRESS, data: "0x3b3cd378" + padHex(i.toString(16)) },
                        "latest"
                    ]).then((data) => Number(BigInt(data)))
                );
            }

            const fileIdsList = await Promise.all(listPromises);
            console.log("fileIdsList", fileIdsList);

            const fileDataPromises = fileIdsList.map((fileId) =>
                callRpc("eth_call", [
                    { to: DATA_REGISTRY_ADDRESS, data: "0xf4c714b4" + padHex(fileId.toString(16)) },
                    "latest"
                ])
            );

            const fileDataList = await Promise.all(fileDataPromises);
            console.log("fileDataList", fileDataList);

            for (let i = 0; i < fileDataList.length; i++) {
                const file = fileDataList[i];
                // decoded: { fileId, ownerAddress, url, addedAtBlock }
                const decoded = decodeFileResponse(file);
                console.log("Decoded file:", decoded);

                // fileRefinement: string
                const fileRefinement = await fetchFileRefinement(decoded.fileId, 15);
                console.log("File refinement:", fileRefinement);

                fileList.push({
                    fileIndex: fileCountNumber - (i + 1),
                    fileId: decoded.fileId,
                    ownerAddress: decoded.ownerAddress,
                    // url: decoded.url,
                    // addedAtBlock: decoded.addedAtBlock,
                    refinementUrl: fileRefinement
                });
            }

            console.log("Final file list:", fileList);
        } catch (error) {
            console.error("Error fetching file list:", error);
            fileList = [];
        }
    }

    function decodeFileResponse(hex) {
        if (hex.startsWith("0x")) hex = hex.slice(2);

        const toUint = (hex) => BigInt("0x" + hex).toString();
        const toAddress = (hex) => "0x" + hex.slice(24);
        const hexToAscii = (hex) => {
            let str = "";
            for (let i = 0; i < hex.length; i += 2) {
                const byte = hex.slice(i, i + 2);
                if (byte === "00") break; // Null-terminated
                str += String.fromCharCode(parseInt(byte, 16));
            }
            return str;
        };

        const get = (start, length = 64) => hex.slice(start, start + length);

        // Tuple starts at offset 0x20
        const base = 64; // skip initial offset

        const fileId = parseInt(get(base), 16);
        const owner = toAddress(get(base + 64));
        const urlOffsetBytes = parseInt(get(base + 128), 16); // Offset to string from start of tuple
        const addedAtBlock = parseInt(get(base + 192), 16);

        const tupleStart = base;
        const urlOffset = tupleStart + urlOffsetBytes * 2; // now it's byte offset to hex offset

        const urlLength = parseInt(get(urlOffset), 16);
        const urlHex = hex.slice(urlOffset + 64, urlOffset + 64 + urlLength * 2);
        const url = hexToAscii(urlHex);

        return { fileId, ownerAddress: owner, url, addedAtBlock };
    }

    async function fetchFileRefinement(fileId, refinerId) {
        try {
            // The function selector for fileRefinements(uint256,uint256)
            const functionSelector = "0x0fbb708b";

            // Pad both parameters to 64 characters (32 bytes)
            const paddedFileId = padHex(fileId.toString(16));
            const paddedRefinerId = padHex(refinerId.toString(16));

            const callData = functionSelector + paddedFileId + paddedRefinerId;

            const refinementData = await callRpc("eth_call", [
                {
                    to: DATA_REGISTRY_ADDRESS,
                    data: callData
                },
                "latest"
            ]);

            // Decode the string return value
            const decodedRefinement = decodeStringResponse(refinementData);
            console.log("File refinement:", { fileId, refinerId, url: decodedRefinement });

            return decodedRefinement;
        } catch (error) {
            console.error("Error fetching file refinement:", error);
            return null;
        }
    }

    function decodeStringResponse(hex) {
        if (!hex || hex === "0x") return "";
        if (hex.startsWith("0x")) hex = hex.slice(2);

        // String encoding in Solidity:
        // First 32 bytes: offset to string data
        // Next 32 bytes: length of string
        // Then the actual string data

        const lengthHex = hex.slice(64, 128); // Get the length (bytes 32-64)
        const length = parseInt(lengthHex, 16);

        if (length === 0) return "";

        const stringData = hex.slice(128, 128 + length * 2); // Each character is 2 hex digits

        let result = "";
        for (let i = 0; i < stringData.length; i += 2) {
            const byte = stringData.slice(i, i + 2);
            if (byte === "00") break; // Null terminator
            result += String.fromCharCode(parseInt(byte, 16));
        }

        return result;
    }

    let lastFetchedCount = 0;

    $effect(() => {
        if (fileCountNumber > 0 && fileCountNumber !== lastFetchedCount) {
            fetchFileIdsList();
            lastFetchedCount = fileCountNumber;
        }
    });
</script>

<table class="table-auto">
    <thead>
        <tr class="border-b">
            <th class="text-center">File ID</th>
            <th class="text-center">Owner Address</th>
            <th class="text-center">Refinement Exists</th>
            <th class="text-center">File Index</th>
        </tr>
    </thead>
    <tbody>
        {#each fileList as file (file.fileId)}
            <tr>
                <td class="text-center">{file.fileId}</td>
                <td class="text-center">{file.ownerAddress.substring(0, 5)} ... {file.ownerAddress.substring(file.ownerAddress.length - 5)}</td>
                <td class="text-center">{file.refinementUrl ? true : false}</td>
                <td class="text-center">{file.fileIndex}</td>
            </tr>
        {/each}
    </tbody>
</table>
