
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Account, Allocation, CollabSplitter } from '../../generated/schema';
import { ONE, ZERO } from '../constants';

import * as accounts from './accounts';

export function get(address: Address) : CollabSplitter | null {
	let id = address.toHex();
	return CollabSplitter.load(id);
}

export function create(address: Address, name: String, recipients: Address[], percents: BigInt[]) : CollabSplitter {
	let id = address.toHex();
	let splitter = new CollabSplitter(id);

	splitter.name = name;
	splitter.allocationsCount = BigInt.fromI32(recipients.length);

	splitter.save();

	for(let i = 0; i < recipients.length; i++) {
		let allocId = id.concat('-').concat((i+1).toString());
		let allocation = new Allocation(allocId);
		allocation.splitter = id;
		allocation.recipient = accounts.get(recipients[i]).id;
		allocation.allocation = percents[i];
		allocation.save();
	}

	return splitter as CollabSplitter;
}