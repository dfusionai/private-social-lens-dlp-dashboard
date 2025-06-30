# Social Truth DLP Overview Dashboard

A super simple svelte-based html+js dashboard to pull simple DLP metrics via RPC. Can extend later.

## Stats

Currently tracking the following:
- <strong>$vFSN balance of the DLP contract</strong> - important for understanding what rewards are remaining in the contract
- <strong>Number of uploads</strong> - number of files uploaded (different from chats as one file can contain many)
- <strong>Last time a file was uploaded</strong> - we get a pretty constant stream, so if this time is "old", then something has gone wrong.

## Running locally

### Installation

I used `nvm` to get `node` lts at time of creation - `v22.16.0`.
This is also using `Vite` so that we can serve locally.

Just install deps:
```bash
npm i
```

### Running locally

```bash
npm run dev -- --open
```

### Build

```bash
npm run build
```

## Design Choices

This is meant to be a fast and flexible dashboard. I chose Svelte so that we're not loading any crazy libraries or have long build times. We're just fetching core data and showing it. If you can avoid installing packages, this will keep the code simple and building / running / loading fast. Example of applying this: I didn't install all the `web3.js` bloat and just did the etherum rpc calls from js.
