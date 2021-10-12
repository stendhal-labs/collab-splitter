This is the repository to create a Subgraph for **_Collab Splitter_** using [The Graph](https://thegraph.com/).

# Installation

After cloning this repository, install ganache-cli

`npm install -g ganache-cli`

and then you can either run `./setup.sh` or go to [The setup section](#setup)

Then you will need to [start](#start) the the chain, [create and deploy](#create-and-deploy-the-graph) the graph

The graph will now listen to the right contract events

## Start

run `./start.sh` to run the ganache cli and the graph node

The chain data will be stored in `./ganache-db` in order to be able to stop and restart at the same state

## Create and deploy the graph

```
cd splitter
npm run create-local
npm run deploy-local
```

# Manual setup (non-recommended)

## Graph-node

`git clone https://github.com/graphprotocol/graph-node/`

If you already have postgres or ipfs running you might want to stop them, TheGraph is not clever enough to launch them on unused ports...

in a new terminal you will need to run these commands to setup TheGraph

```
cd graph-node/docker
./setup.sh
```

## Running the app

I do both next actions in separate terminals:

First launch ganache chain

`ganache-cli -h 0.0.0.0 --deterministic`

Then launch TheGraph

```
cd graph-node/docker
docker-compose up
```

You will also need to add data to the chain so the graph will be able to pick those up.
In the `../contracts` repository, you can run:

`npx hardhat run scripts/local-graph.js --network localhost`

which will deploy a few contracts (SimpleSale, TransferProxy and 2 NFT contracts, add some NFTs to the contracts and do some sales, in order to populate this graph data)

When the script is finished running, verify that the contracts address outputed are the same as the one in: `./splitter/subgraph.yaml`

then you can:

```
cd splitter
npm run codegen
npm run build
npm run create-local
npm run deploy-local
```

## Deploying the app

In order to deploy the app, we will need:

1 - to create an app on TheGraph dashboard

2 - to set the same name in the deploying scripts in `package.json`

3 - to set the right contracts' `address`, `startBlock` and `network` in `./splitter/subgraph.yaml`

We can then run:

`npm run deploy`

to deploy our graph.
