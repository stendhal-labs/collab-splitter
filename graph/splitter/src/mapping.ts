import { BigInt, ethereum } from "@graphprotocol/graph-ts"

import { log } from '@graphprotocol/graph-ts'
import { SplitterCreated } from "../generated/CollabSplitterFactory/CollabSplitterFactory";
import { Transfer } from "../generated/CollabSplitterTokenPayment/ERC20";
import { CollabSplitterToken, ERC20 as ERC20Schema } from "../generated/schema";
import { ERC20 } from "../generated/CollabSplitterTokenPayment/ERC20";

import { ZERO_ADDRESS, ONE, ZERO } from './constants';

import * as erc20s from './providers/erc20s';
import * as splitters from './providers/splitters';

export function handleSplitterCreation(event: SplitterCreated) : void {
  splitters.create(
    event.params.splitter,
    event.params.name,
    event.params.recipients,
    event.params.amounts
  );
}

export function handleTokenPayment(event: Transfer) : void {
  // first check if "event.params.to" is a CollabSplitter
  let splitter = splitters.get(event.params.to);
  if (splitter != null) {
    // create ids
    let erc20Id = event.address.toHex();
    let collabSplitterTokenId = event.params.to.toHex().concat('-').concat(erc20Id);

    // check if there is already a CollabSplitterToken for this collab and this address
    let collabSplitterToken = CollabSplitterToken.load(collabSplitterTokenId);
    if (collabSplitterToken == null) {
      // get the ERC20
      let erc20 = erc20s.get(event.address);

      // create a collab splitter token
      collabSplitterToken = new CollabSplitterToken(collabSplitterTokenId);
      collabSplitterToken.token = erc20.id;
      collabSplitterToken.splitter = splitter.id;

      collabSplitterToken.save();
    }
  }
}
