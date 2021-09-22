
import { Address } from '@graphprotocol/graph-ts';
import { Account } from '../../generated/schema';
import { ONE, ZERO } from '../constants';

export function get(address: Address) : Account {
	let account = Account.load(address.toHex());

	if (!account) {
		account = new Account(address.toHex());
		account.save();
	}

	return account as Account;
}