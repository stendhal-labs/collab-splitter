![Discord](https://img.shields.io/discord/778527994451853333)
[![CircleCI](https://circleci.com/gh/stendhal-labs/collab-splitter/tree/main.svg?style=svg)](https://circleci.com/gh/stendhal-labs/collab-splitter/tree/main)
[![codecov](https://codecov.io/gh/stendhal-labs/collab-splitter/branch/main/graph/badge.svg)](https://codecov.io/gh/stendhal-labs/collab-splitter)
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/stendhal-labs/collab-splitter/blob/main/LICENSE)

# Collab splitter

Collaboration Splitter allows to create a cheap contract in charge of
receiving and splitting Ethereum and ERC20 payments. It can be used to
split earnings from artworks sales if multiple artists were involved or as
the recipient of royalties compatible with the new [EIP-2981: NFT Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)

Available on https://www.collab-splitter.org/

The project has several components:

- **Smartcontracts** (in [`contracts/`](contracts/))
- **The Graph** (in [`graph/`](graph/))
- **SDK** (in [`sdk/`](sdk/))
- **Website** (in [`website/`](website/))

## Usage

Use the SDK or create your contract directly [on the website](https://www.collab-splitter.org/)

![Use cases](doc/collab-splitter-use-cases.png)

### Create a collaboration splitter

In order to create a splitter contract you will need:

- An Ethereum wallet with some ethers (only needed by the splitter creator)
- The list of recipients and their allocations e.g. 13.37%
- A name for your collaboration

Fill out the form, click on the 'Create' button and once your transaction is confirmed and the contract deployed, you will get the address to use for your NFT creations.

### See a collaboration / get info

On this page you can see all the information about a deployed collab splitter.

If you connect your wallet, you will be able to see if you can claim ETH or ERC20.

https://purple-disk-1468.on.fleek.co/collab/0x

### Claim

You can claim **ETH** or the listed **ERC20** from incoming transactions.

You can also claim **individually** or **for all** the contract recipients.

## Gas costs

A full gas report can be obtained in `./contracts` by running `npm run gas-report`.
At the current time November 2021, and at 3682.73 eur/eth, all operations in average costs **around or less than 10 Euro**.
But here are some useful info extracted from it:

| Operation                                    | Average gas cost @21gwei/gas |
| -------------------------------------------- | ---------------------------- |
| Collab Splitter Contract Creation (one time) | 146042                       |
| Claim all ETH and all ERC20 tokens           | 130923                       |
| Claim ETH                                    | 78647                        |
| Claim tokens of an ERC20 e.g. DAI            | 137960                       |

Please note that gas costs for claiming ERC20 tokens can increase depending on their contract and implementation.

If you want to help us reduce the gas costs, all suggestions/PR are more than welcomed !

## FAQ

> Is there a limit on the number of recipients ?

Simple answer: **No**

> How are gas fees handled?

There are 2 potential sources of gas fees as a collaborator:

- Gas fees related to the creation of the collab splitter contract that are paid only once by one of the artists (or even someone else)
- Gas fees related to claims done by every collaborator when they want to transfert their funds

Receiving ETH or ERC20 as sales revenues or royalties will always be paid by sender so 0 gas fees for a collaborator !

> How much decimals can I set for each split ?

You can go down to 0.01%. We chose the .00 precision to make it easy to use as a percentage and various technical reasons.

> Can I try it ?

Yes of course, you can test all the features on the **Rinkeby** test network on https://rinkeby.collab-splitter.org/

Don't forget to get some Rinkeby ETH from the faucet https://faucet.rinkeby.io/

## Installation

Simply run `npm run install:all` or ` npm run install:all:pnpm` if you are using [pnpm](https://pnpm.io/).

This will install all the necessary `node_modules`, to run each component individually please see their respective `README.md` files.

## Contributing

Contributions are always welcome! Feel free to open any issue or send a pull request.
Check out the [contribution guide](CONTRIBUTING.md/) to learn about how to set up !

## License

Collab splitter is released under the [MIT License](LICENSE).
