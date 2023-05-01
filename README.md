# hollowdb-express

Hollowdb express server..

Clone the repo and cd into the direcotry

```bash
git clone https://github.com/firstbatchxyz/hollowdb-express.git
cd hollowdb-express
```

Put your arweave wallet under `src/configurations` and name it to `wallet.json`

```
src/
├── clients
├── configurations/
|   ├── index.js
|   ├── verkey.json
|   └── wallet.json <- your wallet
├── controllers
.
.
```

Setup

```bash
yarn
```

Start the server

```bash
yarn start <contract id>
```
