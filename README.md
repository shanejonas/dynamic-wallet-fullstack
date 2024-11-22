# Fullstack Authenticated Wallet API + UI

This is a fullstack application that allows you to create a custodial wallet, get the balance of the wallet, and send transactions to the wallet.

## What's inside?

This includes the following packages/apps:

### Apps and Packages

- `server`: a JSON-RPC based [Nest.js](https://nestjs.com/) server
    - uses [dynamic.xyz](https://dynamic.xyz/) for auth
    - [uses `openrpc-nestjs-json-rpc` `@ZodToOpenRPC` decorator](https://github.com/shanejonas/openrpc-nestjs-json-rpc/#zod-validation) to generate an OpenRPC document
        - generates an OpenRPC document and serves it via the `rpc.discover` method
        - you can point the playground to this server to render the interactive API docs (doesnt work in brave since it blocks localhost by default, works in chrome)
            - https://playground.open-rpc.org/?url=http://localhost:8080/rpc/v1/ 
                - Note: you must add an Authorization header with a valid JWT token in the UI for the playground interactive requests to work as they are authenticated
- `web`: a [Next.js](https://nextjs.org/) app
    - uses [dynamic.xyz](https://dynamic.xyz/) for auth
    - uses tailwind css for styling
    - uses react-jsonschema-form to generate the form UI
    - uses `rpc.discover` to fetch the OpenRPC document from the server and dynamically generate the UI for the methods
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Authentication

The server and web app both use [Dynamic](https://dynamic.xyz/) to authenticate users. You need to set the `NEXT_PUBLIC_DYNAMIC_ENV_ID` environment variable to your own Dyanamic Environment ID to have both the server and the web app pick it up. You can get your own environment ID by creating an account on [Dynamic](https://dynamic.xyz/) and going to Developers > SDK & API Keys.


## Sepolia Testnet

This uses sepolia testnet. You can get testnet ETH from [here](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) without any captchas or authorization. Heres an example of a tx sent from the this app: https://sepolia.etherscan.io/tx/0x759d9a5a93a99fdad603a6b37a68f874d07e24ea8feb5d26b557d859af2dff75


### Develop


This repo uses NPM workspaces to manage dependencies.

```
npm install
```

Set the `NEXT_PUBLIC_DYNAMIC_ENV_ID` environment variable to your own Dyanamic Environment ID.

```
export NEXT_PUBLIC_DYNAMIC_ENV_ID=<your-dynamic-env-id>
```

To develop all apps and packages, run the following command:

```
npm run dev
```

it will run a web server at http://localhost:3000 and a JSON-RPC server at http://localhost:8080/rpc/v1.

### Build

To build all apps and packages, run the following command:

```
npm run build
```