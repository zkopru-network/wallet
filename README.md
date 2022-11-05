# Zkopru Wallet

A user interface for interacting with the Zkopru L2 application.

Draft accessible [here](https://alpha.wallet.zkopru.network/).

[![](./ipfs_badge.svg)](https://ipfs.zkopru.network/ipfs/Qmb7eArt2A13mBgrAjKwnR2AXg5cU5AAefWxAMS2NmaGp7) <!-- badge -->

## Setup

Install modules as usual with `npm install`.

Additionally we need the `@zkopru/client` package. This needs to be linked locally because it's not published on npm. This can be done using yarn by running the following:

- First in `zkopru/packages/client`: `yarn link`
- Then in `zkopru-web`: `yarn link @zkopru/client`

## Development

A development server with hot reload can be started with `npm run dev` it will be accessible at `localhost:8080`.

## Development alongside @zkopru/client

the web wallet download `@zkopru/client` module from npm while installing. for more convenience to develop alongside @zkopru/client, It would be better to use a client package that is locally cloned.

For that, you can run `npm run install-dev`. It will run the script that clones the zkopru repo with the main branch then setup and build.

If you are using the default hardhat node configuration in local environment, It would not need to load `.env` file.

In some cases, you have to create `.env` (using `.env.example`) and then modify the hardhat node url, zkopru contract address and the chainId in the env file for connecting your hardhat node.
And please do not forget to build with `npm run build:dev` for applying the variables to the web server.

To revert this setup, you can simply overwrite `package.json` with `package-prod.json` and then install it again.
