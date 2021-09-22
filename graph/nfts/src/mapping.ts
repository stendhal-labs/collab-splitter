import { BigInt, ethereum } from "@graphprotocol/graph-ts"

import { log } from '@graphprotocol/graph-ts'
import { SplitterCreated } from "../generated/CollabSplitterFactory/CollabSplitterFactory";

import { ZERO_ADDRESS, ONE, ZERO } from './constants';

import * as splitters from './providers/splitters';

export function handleSplitterCreation(event: SplitterCreated) : void {
  splitters.create(
    event.params.splitter,
    event.params.name,
    event.params.recipients,
    event.params.amounts
  );
}
