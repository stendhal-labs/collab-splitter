import { Address, ethereum } from "@graphprotocol/graph-ts"

import { ERC20 } from "../../generated/CollabSplitterTokenPayment/ERC20";
import { ERC20 as ERC20Schema } from "../../generated/schema";

export function get(address: Address) : ERC20Schema {
	let erc20Id = address.toHex();
	let erc20 = ERC20Schema.load(erc20Id);
	if (erc20 == null) {
		erc20 = new ERC20Schema(erc20Id);

		// connect to erc20 contract
		let contract = ERC20.bind(address);

		let tryName = contract.try_name();
		erc20.name = tryName.reverted ? '' : tryName.value;

		let trySymbol = contract.try_symbol();
		erc20.symbol = trySymbol.reverted ? '' : trySymbol.value;

		erc20.save();
	}

	return erc20 as ERC20Schema;
}
