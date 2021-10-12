# How to contribute to collab-splitter

This document contains some tips on how to collaborate in this project.

## Filing an issue

If you find a bug or want to propose a new feature, please [open an issue](https://github.com/stendhal-labs/collab-splitter/issues/new).
Pull requests are welcome, but we recommend you discuss it in an issue first, especially for big changes. This will increase the odds that we can accept your PR.

## Project structure

This repository is a monorepo with the following subfolders:

- **Solidity smart contracts** (in [`contracts/`](contracts/))
- **The Graph** (in [`graph/`](graph/)) for indexing blockchain events
- **SDK** (in [`sdk/`](sdk/)) a small lib for using MerkleTree, Root and Proof for collaborations with `ethers.js`
- **Website** (in [`website/`](website/)) the frond-end written in Svelte

## Installing

To install the project's dependencies, run `npm install` in the root directory of the repository.

## Building & testing the projects

Into each subfolders follow the `README.md` instructions to get everything runnning.

## Code formatting

We use [Prettier](https://prettier.io/) to format all the code without any special configuration. Whatever Prettier does is considered The Right Thing. It's completely fine to commit non-prettied code and then reformat it in a later commit.

We also have [eslint](https://eslint.org/) installed in all the projects. It checks that you have run Prettier and forbids some dangerous patterns.

The linter is always run in the CI, so make sure it passes before pushing code. You can use `pnpm lint` and `pnpm lint:fix` inside the packages' folders.

## Branching

We work on the branch [`main`](https://github.com/stendhal-labs/collab-splitter/tree/main). Versions of the different packages are always tagged and pushed to GitHub. So if you are looking for the latests released version of something, please refer to the tags.

Please, branch from `main` when implementing a new feature or fixing a bug, and use it as the base branch in pull requests.

## Common errors
