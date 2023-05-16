[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Test Workflow](https://github.com/firstbatchxyz/hollowdb-express/actions/workflows/test.yml/badge.svg?branch=master)
[![Discord](https://dcbadge.vercel.app/api/server/2wuU9ym6fq?style=flat)](https://discord.gg/2wuU9ym6fq)

# HollowDB Backend - ExpressJS

HollowDB backend using ExpressJS.

## Usage

Clone the repo:

```bash
git clone https://github.com/firstbatchxyz/hollowdb-express.git
cd hollowdb-express
```

Install the packages with:

```bash
yarn
```

Put your Arweave wallet in `secrets/wallet.json`. Then, start the server by providing the contract transaction id to connect to:

```bash
yarn start <contract-txid>
```

## Test

You can run the Mocha tests where a local Arweave node will be created during the test, and the tests will be run over an ephemeral backend connected to a local contract.

```sh
yarn test
```
