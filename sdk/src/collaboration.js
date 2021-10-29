import * as ethers from 'ethers';

import * as factoryABI from './data/abis/factory';
import * as splitterABI from './data/abis/splitter';

import { getProof, getRoot } from './merkleproof';

/**
 * Create a collab-splitter contract using the factory contract
 * (verification/validation of inputs are done by the factory contract in Solidity)
 * @param name string
 * @param recipients Recipient[]
 * @param signer Signer | Provider
 * @returns
 */
export async function create(name, recipients, signer) {
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

export async function getTotalReceived(collabId, signer) {
	const contract = new ethers.Contract(collabId, splitterABI, signer);
	return contract.totalReceived();
}

/**
 * Check if account can claim something (ETH or ERC20) by calling contract methods
 * @param collabId string
 * @param account string
 * @param percent string
 * @param tokenAddresses string[]
 * @param signer Signer | Provider
 * @returns
 */
export async function isThereSomethingToClaimForAccount(
	collabId,
	account,
	percent,
	tokenAddresses,
	signer
) {
	const claimable = await getClaimable(collabId, account, percent, tokenAddresses, signer);
	return isThereSomethingToClaim(claimable);
}

/**
 * Check if account can claim something (ETH or ERC20) from retrieved contract data
 * @param claimable
 * @returns
 */
export function isThereSomethingToClaim(claimable) {
	return (
		claimable &&
		((claimable.eth && claimable.eth.gt(0)) ||
			(claimable.erc20 && claimable.erc20.some((erc20) => erc20.gt(0))))
	);
}

/**
 * Check how much ETH & ERC20 can be claimed (for ONE account)
 * @param collabId string
 * @param account string
 * @param percent string
 * @param tokenAddresses string[]
 * @param signer Signer | Provider
 * @returns
 */
export async function getClaimable(collabId, account, percent, tokenAddresses, signer) {
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
 * @param collabId string
 * @param accounts string[]
 * @param percents string[]
 * @param tokenAddresses string[]
 * @param signer Signer | Provider
 * @returns
 */
export async function getBatchClaimable(collabId, accounts, percents, tokenAddresses, signer) {
	// create contract
	const contract = new ethers.Contract(collabId, splitterABI, signer);

	const claimableETH = await contract.getBatchClaimableETH(accounts, percents);
	let claimableERC20 = new Array(accounts.length);
	claimableERC20.fill([]);
	if (tokenAddresses.length > 0) {
		let claimableERC20ByToken = [];
		for (let token of tokenAddresses) {
			claimableERC20ByToken = await contract.getBatchClaimableERC20(accounts, percents, token);
			for (let j = 0; j < accounts.length; j++) {
				claimableERC20[j] = [...claimableERC20[j], claimableERC20ByToken[j]];
			}
		}
	}

	return {
		eth: claimableETH,
		erc20: claimableERC20
	};
}

/**
 * Get already claimed ETH & ERC20 tokens from contract
 * @param collabId string
 * @param account string
 * @param tokenAddresses string[]
 * @param signer Signer | Provider
 * @returns
 */
export async function getAlreadyClaimed(collabId, account, tokenAddresses, signer) {
	const contract = new ethers.Contract(collabId, splitterABI, signer);

	const alreadyClaimedETH = await contract.alreadyClaimed(account);
	let alreadyClaimedERC20 = [];
	if (tokenAddresses.length > 0) {
		alreadyClaimedERC20 = await contract.getBatchClaimed(account, tokenAddresses);
	}

	return {
		eth: alreadyClaimedETH,
		erc20: alreadyClaimedERC20
	};
}

/**
 * Claim ETH & all available ERC20 tokens for a collab
 * @param account string
 * @param collab
 * @param signer Signer | Provider
 * @returns
 */
export async function claimBatch(account, collab, signer) {
	if (!(account && collab)) {
		throw new Error('Invalid parameter');
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, signer);

	const recipients = collab.allocations.map((a) => ({
		account: a.recipient.id,
		percent: a.allocation
	}));
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
 * @param account string
 * @param collab
 * @param signer Signer | Provider
 * @returns
 */
export async function claimETH(account, collab, signer) {
	if (!account || !collab) {
		throw new Error('Invalid parameter');
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, signer);

	const recipients = collab.allocations.map((a) => ({
		account: a.recipient.id,
		percent: a.allocation
	}));
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
 * @param account string
 * @param collab
 * @param tokenAddress string
 * @param signer Signer | Provider
 * @returns
 */
export async function claimERC20(account, collab, tokenAddress, signer) {
	if (!account || !collab || !tokenAddress) {
		throw new Error('Invalid parameter');
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, signer);

	const recipients = collab.allocations.map((a) => ({
		account: a.recipient.id,
		percent: a.allocation
	}));
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
	return collab.tokens.map((token) => token.token.id);
}
