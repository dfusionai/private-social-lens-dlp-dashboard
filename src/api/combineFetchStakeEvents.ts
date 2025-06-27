// import { ENV_CONFIG } from "$lib/const";
// import { ethers } from "ethers";
// import stakingAbi from "../assets/contracts/staking-abi.json";

// export const fetchStakingEvents = async () => {
//     const blockRangeForAMonth = 432000;
//     const maxBlockRange = 10000;
//     const monthlyData = [];
//     const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);

//     const currentBlock = await provider.getBlockNumber();
//     const startBlock = Math.max(0, currentBlock - 6 * blockRangeForAMonth);

//     const stakingContract = new ethers.Contract(
//         ENV_CONFIG.VITE_STAKING_ADDRESS,
//         stakingAbi.abi,
//         provider
//     );

//     for (let i = 0; i < 6; i++) {
//         // Calculate block range
//         const fromBlock = startBlock + i * blockRangeForAMonth;
//         const toBlock = Math.min(fromBlock + blockRangeForAMonth, currentBlock);

//         if (fromBlock >= currentBlock) {
//             break;
//         }

//         try {
//             // Split into 10,000-block chunks and query concurrently
//             const blockRanges = [];
//             for (let from = fromBlock; from <= toBlock; from += maxBlockRange) {
//                 const to = Math.min(from + maxBlockRange - 1, toBlock);
//                 blockRanges.push({ from, to });
//             }

//             // Query stake and unstake events concurrently
//             const stakePromises = blockRanges.map(({ from, to }) =>
//                 stakingContract.queryFilter(
//                     stakingContract.filters.TokensStaked(),
//                     from,
//                     to
//                 )
//             );
//             const unstakePromises = blockRanges.map(({ from, to }) =>
//                 stakingContract.queryFilter(
//                     stakingContract.filters.TokensUnstaked(),
//                     from,
//                     to
//                 )
//             );

//             const [stakeResults, unstakeResults] = await Promise.all([
//                 Promise.all(stakePromises),
//                 Promise.all(unstakePromises),
//             ]);

//             // Flatten results
//             const stakeEvents = stakeResults.flat();
//             const unstakeEvents = unstakeResults.flat();

//             // Calculate totals using BigInt (ethers v6)
//             const totalStaked = stakeEvents.reduce((sum: bigint, event: any) => {
//                 const eventLog = event as any;
//                 const amount = eventLog.args[1]
//                     ? BigInt(eventLog.args[1])
//                     : BigInt(0);
//                 return sum + amount;
//             }, BigInt(0));

//             const totalUnstaked = unstakeEvents.reduce((sum: bigint, event: any) => {
//                 const eventLog = event as any;
//                 const amount = eventLog.args?.amount
//                     ? BigInt(eventLog.args.amount)
//                     : BigInt(0);
//                 return sum + amount;
//             }, BigInt(0));

//             const monthData = {
//                 totalStaked: Number(ethers.formatEther(totalStaked)),
//                 totalUnstaked: Number(ethers.formatEther(totalUnstaked)),
//                 eventCount: stakeEvents.length + unstakeEvents.length,
//             };

//             monthlyData.push(monthData);
//         } catch (error) {
//             monthlyData.push({
//                 totalStaked: 0,
//                 totalUnstaked: 0,
//                 eventCount: 0,
//             });
//         }
//     }

//     return monthlyData;
// };
