# Collaboration splitter smarcontracts

Smartcontracts for collaboration splitters using Solidity `0.8.0` and [Hardhat](https://hardhat.org/)

The most important files are :

-   `CollabSplitterFactory` which allow the creation and deployment of a CollabSplitter contract from user transaction.
-   `CollabSplitter` the minimal proxy contract receiving ETH or ERC20 to be split accross recipients.

The allocations & associated recipients are described with a **Merkle Root** to greatly reduce gas comsumption.

## Installation

```
cd contracts
npm install
```

Then copy the `env.SAMPLE` file to .env and replace your variables.

## Test

`npm run test`

### Coverage

See coverage using `npm run coverage`

### Gas reporter

If you want to know more about gas usage, you can run `npm run gas-report`

## Deployments

The `CollabSplitterFactory` has been deployed to the following network.

| Network | Address |
| ------- | ------- |
| Rinbeky | 0x      |
| Mainnet | 0x      |
