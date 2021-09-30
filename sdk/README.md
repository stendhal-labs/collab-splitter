
# Collab Splitter SDK

This SDK easily builds a small library (using ethers.js) to create a MerkleTree, Root and Proof for collaborations.

## Install

`pnpm install`

##  Dev

`pnpm run dev`

##  Build

`pnpm run build`

## API

`getNode(recipient, percentage)`

Allows to calculate the hash of a node to use in the tree

`getRoot`

Allows to calculate the root of a tree given an array of [{ recipient, percentage }, ...]

`getProof`

Gets the proof (all needed nodes) to use when trying to claim.
The result of the proof will be compared to the initial MerkleRoot to determine if a node is actually part of the tree.
