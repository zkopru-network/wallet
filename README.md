# Zkopru Wallet

A user interface for interacting with the Zkopru L2 application.

Draft accessible [here](https://zkopru.tubby.cloud/).

[![](./ipfs_badge.svg)](https://ipfs.io/ipfs/QmRKZfy8sqU4gpU4ZrGR1JB9Lr33pkzdCUgHJDjiEVPAYH) <!-- badge -->

## Setup

Install modules as usual with `npm install`.

Additionally we need the `@zkopru/client` package. This needs to be linked locally because it's not published on npm. This can be done using yarn by running the following:

- First in `zkopru/packages/client`: `yarn link`
- Then in `zkopru-web`: `yarn link @zkopru/client`

## Development

A development server with hot reload can be started with `npm run dev` it will be accessible at `localhost:8080`.
