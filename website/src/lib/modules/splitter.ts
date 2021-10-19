import sdk from '../../../../sdk/';
import { Recipient } from './Recipient';
import { getSigner } from './wallet';
import splitterABI from '../data/abis/splitter';

/**
 * Check if account can claim something (ETH or ERC20) by calling contract methods
 * @param collabId
 * @param account
 * @param percent
 * @param tokenAddresses
 * @returns
 */
export async function isThereSomethingToClaimForAccount(
	collabId: string,
	account: string,
	percent: number,
	tokenAddresses: string[]
): Promise<boolean> {
	const claimable = await getClaimable(collabId, account, percent, tokenAddresses);
	return isThereSomethingToClaim(claimable);
}

/**
 * Check if account can claim something (ETH or ERC20) from retrieved contract data
 * @param claimable
 * @returns
 */
export function isThereSomethingToClaim(claimable): boolean {
	return claimable && (claimable.eth?.gt(0) || claimable.erc20?.some((erc20) => erc20.gt(0)));
}

/**
 * Check how much ETH & ERC20 can be claimed (for ONE account)
 * @param collabId
 * @param account
 * @param percent
 * @param tokenAddresses
 * @returns
 */
export async function getClaimable(
	collabId: string,
	account: string,
	percent: number,
	tokenAddresses: string[]
) {
	const batchClaimable = await getBatchClaimable(collabId, [account], [percent], tokenAddresses);

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
 * @returns
 */
export async function getBatchClaimable(
	collabId: string,
	accounts: string[],
	percents: number[],
	tokenAddresses: string[]
) {
	// create contract
	const contract = new ethers.Contract(collabId, splitterABI, await getSigner());

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
 * @returns
 */
export async function getAlreadyClaimed(
	collabId: string,
	account: string,
	tokenAddresses: string[]
) {
	const contract = new ethers.Contract(collabId, splitterABI, await getSigner());

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
 * Claim ETH & all availables ERC20 tokens for a collab
 * @param account
 * @param collab
 * @returns
 */
export async function claimBatch(account: string, collab) {
	if (!account || !collab) {
		return;
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, await getSigner());

	const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));
	const accountIndex = recipients.findIndex((r) => account === r.account);

	const tokenAddresses = getTokenAddresses(collab);

	console.log(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		sdk.getProof(recipients, accountIndex),
		tokenAddresses
	);

	const events = await contract
		.claimBatch(
			recipients[accountIndex].account,
			recipients[accountIndex].percent,
			sdk.getProof(recipients, accountIndex),
			tokenAddresses
		)
		.then((tx) => tx.wait())
		.then((receipt) => {
			console.log(receipt);
			return receipt;
		})
		.then((receipt) => receipt.events);
}

/**
 * Claim ethers for a collab
 * @param account
 * @param collab
 * @returns
 */
export async function claimETH(account: string, collab) {
	if (!account || !collab) {
		return;
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, await getSigner());

	const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));
	const accountIndex = recipients.findIndex((r) => account === r.account);

	console.log(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		sdk.getProof(recipients, accountIndex)
	);

	const events = await contract
		.claimETH(
			recipients[accountIndex].account,
			recipients[accountIndex].percent,
			sdk.getProof(recipients, accountIndex)
		)
		.then((tx) => tx.wait())
		.then((receipt) => {
			console.log(receipt);
			return receipt;
		})
		.then((receipt) => receipt.events);
}
/**
 * Claim tokens of a ERC20 contract for a collab
 * @param account
 * @param collab
 * @param tokenAddress
 * @returns
 */
export async function claimERC20(account: string, collab, tokenAddress: string) {
	if (!account || !collab || !tokenAddress) {
		return;
	}
	// create contract
	const contract = new ethers.Contract(collab.id, splitterABI, await getSigner());

	const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));
	const accountIndex = recipients.findIndex((r) => account === r.account);

	console.log(
		recipients[accountIndex].account,
		recipients[accountIndex].percent,
		sdk.getProof(recipients, accountIndex)
	);
	const eventsERC20 = await contract
		.claimERC20(
			recipients[accountIndex].account,
			recipients[accountIndex].percent,
			sdk.getProof(recipients, accountIndex),
			[tokenAddress]
		)
		.then((tx) => tx.wait())
		.then((receipt) => {
			console.log(receipt);
			return receipt;
		})
		.then((receipt) => receipt.events);
}
/**
 * Convert token contract addresses from TheGraph to string array
 * @param collab
 * @returns
 */
export function getTokenAddresses(collab) {
	return collab?.tokens.map((token) => token.token.id);
}
