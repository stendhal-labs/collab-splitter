import * as ethers from 'ethers';
import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber } from 'ethers';

import * as factoryABI from './data/abis/factory';
import * as splitterABI from './data/abis/splitter';

import { getProof, getRoot } from './merkleproof';
import { Recipient } from './model/Recipient';

type Claimable = {
	eth: BigNumber;
	erc20?: BigNumber[];
};

/**
 * Create a collab-splitter contract using the factory contract
 * (verification/validation of inputs are done by the factory contract in Solidity)
 * @param name
 * @param recipients
 * @param signer
 * @returns
 */
export async function create(name: string, recipients: Recipient[], signer: Signer | Provider) {
	// calculate tree root
	const root = getRoot(recipients);

	// create contract
	const contract = new ethers.Contract(process.env.FACTORY_ADDRESS, factoryABI, signer);

	// create collab splitter
	return contract.createSplitter(
		name,
		root,
		recipients.map((a) => a.account),
		recipients.map((a) => a.percent)
	);
}

export async function getTotalReceived(collabId: string, signer: Signer | Provider) {
	const contract = new ethers.Contract(collabId, splitterABI, signer);
	return contract.totalReceived();
}

/**
 * Check if account can claim something (ETH or ERC20) by calling contract methods
 * @param collabId
 * @param account
 * @param percent
 * @param tokenAddresses
 * @param signer
 * @returns
 */
export async function isThereSomethingToClaimForAccount(
	collabId: string,
	account: string,
	percent: number,
	tokenAddresses: string[],
	signer: Signer | Provider
): Promise<boolean> {
	const claimable = await getClaimable(collabId, account, percent, tokenAddresses, signer);
	return isThereSomethingToClaim(claimable);
}

/**
 * Check if account can claim something (ETH or ERC20) from retrieved contract data
 * @param claimable
 * @returns
 */
export function isThereSomethingToClaim(claimable: Claimable): boolean {
	return claimable && (claimable.eth?.gt(0) || claimable.erc20?.some((erc20) => erc20.gt(0)));
}

/**
 * Check how much ETH & ERC20 can be claimed (for ONE account)
 * @param collabId
 * @param account
 * @param percent
 * @param tokenAddresses
 * @param signer
 * @returns
 */
export async function getClaimable(
	collabId: string,
	account: string,
	percent: number,
	tokenAddresses: string[],
	signer: Signer | Provider
): Promise<Claimable> {
	const batchClaimable = await getBatchClaimable(
		collabId,
		[account],
		[percent],
		tokenAddresses,
		signer
	);

	return {
		eth: batchClaimable.eth[0],
		erc20: batchClaimable.erc20[0]
	};
}

/**
 * Check how much ETH & ERC20 can be claimed (for multiple accounts)
 * @param collabId
 * @param accounts
 * @param percents
 * @param tokenAddresses
 * @param signer
 * @returns
 */
export async function getBatchClaimable(
	collabId: string,
	accounts: string[],
	percents: number[],
	tokenAddresses: string[],
	signer: Signer | Provider
) {
	// create contract
	const contract = new ethers.Contract(collabId, splitterABI, signer);

	const claimableETH = await contract.getBatchClaimableETH(accounts, percents);
	let claimableERC20 = [];
	if (tokenAddresses?.length > 0) {
		for (let token of tokenAddresses) {
			claimableERC20.push(await contract.getBatchClaimableERC20(accounts, percents, token));
		}
	}

	return {
		eth: claimableETH,
		erc20: claimableERC20
	};
}

/**
 * Get already claimed ETH & ERC20 tokens from contract
 * @param collabId
 * @param account
 * @param tokenAddresses
 * @param signer
 * @returns
 */
export async function getAlreadyClaimed(
	collabId: string,
	account: string,
	tokenAddresses: string[],
	signer: Signer | Provider
) {
	const contract = new ethers.Contract(collabId, splitterABI, signer);

	const alreadyClaimedETH = await contract.alreadyClaimed(account);
	let alreadyClaimedERC20 = [];
	if (tokenAddresses?.length > 0) {
		alreadyClaimedERC20.push(await contract.getBatchClaimed(account, tokenAddresses));
	}

	return {
		eth: alreadyClaimedETH,
		erc20: alreadyClaimedERC20
	};
}

/**
 * Claim ETH & all available ERC20 tokens for a collab
 * @param account
 * @param collab
 * @param signer
 * @returns
 */
export async function claimBatch(account: string, collab, signer: Signer | Provider) {
	if (!account || !collab) {
		return;
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, signer);

	const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));
	const accountIndex = recipients.findIndex((r) => account === r.account);

	const tokenAddresses = getTokenAddresses(collab);

	console.log(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		getProof(recipients, accountIndex),
		tokenAddresses
	);

	return contract.claimBatch(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		getProof(recipients, accountIndex),
		tokenAddresses
	);
}

/**
 * Claim ETH for a collab
 * @param account
 * @param collab
 * @param signer
 * @returns
 */
export async function claimETH(account: string, collab, signer: Signer | Provider) {
	if (!account || !collab) {
		return;
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, signer);

	const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));
	const accountIndex = recipients.findIndex((r) => account === r.account);

	console.log(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		getProof(recipients, accountIndex)
	);

	return contract.claimETH(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		getProof(recipients, accountIndex)
	);
}
/**
 * Claim tokens of a ERC20 contract for a collab
 * @param account
 * @param collab
 * @param tokenAddress
 * @param signer
 * @returns
 */
export async function claimERC20(
	account: string,
	collab,
	tokenAddress: string,
	signer: Signer | Provider
) {
	if (!account || !collab || !tokenAddress) {
		return;
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, signer);

	const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));
	const accountIndex = recipients.findIndex((r) => account === r.account);

	console.log(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		getProof(recipients, accountIndex)
	);
	return contract.claimERC20(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		getProof(recipients, accountIndex),
		[tokenAddress]
	);
}

/**
 * Convert token contract addresses from TheGraph to string array
 * @param collab
 * @returns
 */
export function getTokenAddresses(collab) {
	return collab?.tokens.map((token) => token.token.id);
}
