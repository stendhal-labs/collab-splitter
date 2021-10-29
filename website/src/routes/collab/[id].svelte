<script context="module">
	import { getCollab } from '../../../../sdk/';
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const collab = await getCollab(fetch, page.params.id);
		return {
			props: {
				collab
			}
		};
	}
</script>

<script>
	import { variables } from '$lib/modules/variables';
	import { account, getSigner, provider } from '$lib/modules/wallet';
	import { convertBigIntToPercentage } from '$lib/utils/utils';

	import {
		getTokenAddresses,
		getTotalReceived,
		getClaimable,
		getAlreadyClaimed,
		claimETH,
		claimERC20,
		claimBatch,
		isThereSomethingToClaim
	} from '../../../../sdk/';
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';

	export let collab;

	$: myAllocation = collab?.allocations.find((a) => $account === a.recipient.id);

	const recipients = collab.allocations.map((a) => ({
		account: a.recipient.id,
		percent: a.allocation
	}));

	let contractBalance;
	let accountClaimable;
	let alreadyClaimed;
	let totalReceived;

	let tokenAddresses = getTokenAddresses(collab);

	$: {
		if ($account) {
			updateDataFromContract();
		}
	}

	async function updateDataFromContract() {
		contractBalance = await $provider.getBalance(collab.id);
		totalReceived = await getTotalReceived(collab.id, await getSigner());

		accountClaimable = await getClaimable(
			collab.id,
			$account,
			myAllocation.allocation,
			tokenAddresses,
			await getSigner()
		);
		alreadyClaimed = await getAlreadyClaimed(
			collab.id,
			$account,
			tokenAddresses,
			await getSigner()
		);

		// ethToClaim = await contract.getBatchClaimableETH(
		// 	recipients.map((r) => r.account),
		// 	recipients.map((r) => r.percent)
		// );
	}

	async function onClaim() {
		try {
			await claimETH($account, collab, await getSigner());
		} catch (err) {
			console.error(err);
			if (err?.data?.message) {
				alert(`Failed to claim ETH: \n\n${err.message} \n${err.data.message}`);
			} else {
				alert(`Failed to claim ETH: \n\n${err.message}`);
			}
		}
	}
	async function onClaimERC20(tokenAddress) {
		try {
			await claimERC20($account, collab, tokenAddress, await getSigner());
		} catch (err) {
			console.error(err);
			if (err?.data?.message) {
				alert(`Failed to claim ERC20: \n\n${err.message} \n${err.data.message}`);
			} else {
				alert(`Failed to claim ERC20: \n\n${err.message}`);
			}
		}
	}

	async function onClaimBatch() {
		try {
			await claimBatch($account, collab, await getSigner());
		} catch (err) {
			console.error(err);
			if (err?.data?.message) {
				alert(`Failed to claim ETH & ERC20: \n\n${err.message} \n${err.data.message}`);
			} else {
				alert(`Failed to claim ETH & ERC20: \n\n${err.message}`);
			}
		}
	}
</script>

<main>
	{#if collab}
		<h1>{collab.name || ''}</h1>

		<OnlyConnected>
			<div class="actions">
				{#if myAllocation}
					<div class="actions__etherc20">
						<button on:click={onClaimBatch} disabled={!isThereSomethingToClaim(accountClaimable)}
							>Claim {accountClaimable && accountClaimable.eth
								? ethers.utils.formatEther(accountClaimable.eth)
								: ''} ETH & {accountClaimable && accountClaimable.erc20
								? accountClaimable.erc20.length
								: 'all'} ERC20</button
						>
					</div>
				{:else}
					You are not one of the recipient of this contract.
				{/if}
			</div>
			<h2>Balance</h2>
			<div class="balance">
				{#if contractBalance}
					<p>
						Current contract's balance:
						<b>{ethers.utils.formatEther(contractBalance)}</b> ETH
					</p>
				{/if}
				{#if totalReceived}
					<p>
						Total received by contract:
						<b>{ethers.utils.formatEther(totalReceived)}</b> ETH
					</p>
				{/if}
				<h3>My allocation ({convertBigIntToPercentage(myAllocation.allocation)}%)</h3>

				<div class="claim-wrapper">
					<p>Ethereum</p>
					<button
						on:click={onClaim}
						disabled={accountClaimable && accountClaimable.eth && accountClaimable.eth.lte(0)}
						>Claim {accountClaimable && accountClaimable.eth
							? ethers.utils.formatEther(accountClaimable.eth)
							: ''} ETH</button
					>
					<!-- <details>
					<summary>Tokens to claim</summary> -->
					{#if collab.tokens.length > 0}
						{#each collab.tokens as token, index}
							<p>
								{token.token.name}
								(<a href="{variables.EXPLORER_URL}/token/{token.token.id}"
									>{token.token.symbol.toUpperCase()}</a
								>)
							</p>
							<button
								on:click={() => onClaimERC20(token.token.id)}
								disabled={accountClaimable?.erc20[index].lte(0)}
								>Claim {accountClaimable && accountClaimable.erc20[index]
									? accountClaimable?.erc20[index]
									: ''}
								{token.token.symbol.toUpperCase()}</button
							>
						{/each}
					{:else}
						<p>No ERC20 tokens received.</p>
					{/if}
				</div>
				<div>
					{#if alreadyClaimed}
						<h3>Claimed</h3>
						<p>
							You already claimed <b>{ethers.utils.formatEther(alreadyClaimed.eth)}</b> ETH
						</p>
						{#each alreadyClaimed.erc20 as claimedToken, index}
							<p>
								And <b>{claimedToken}</b>
								{collab.tokens[index].token.symbol.toUpperCase()}
							</p>
						{/each}
						<p />
					{/if}
				</div>
				<!-- </details> -->
			</div>
		</OnlyConnected>

		<h2>Contract:</h2>
		<a href="{variables.EXPLORER_URL}/address/{collab.id}">{collab.id || ''}</a>

		<h2>Allocations (<b>{collab.allocationsCount}</b>):</h2>

		<div class="allocations">
			<table>
				<thead>
					<tr>
						<th>Address</th>
						<th>Percentage</th>
					</tr>
				</thead>
				<tbody>
					{#each collab.allocations as allocation, index}
						<tr class:tr--account={allocation.recipient.id === $account}>
							<td>
								{allocation.recipient.id}
							</td>
							<td class="td--right">{convertBigIntToPercentage(allocation.allocation)}%</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="error">Collaboration not found 😥</p>
	{/if}
</main>

<style lang="postcss">
	.actions {
		@apply grid justify-center gap-8;
	}

	.actions__etherc20 {
		@apply col-span-2;
	}

	.actions button {
		@apply w-full;
	}

	.claim-wrapper {
		@apply grid grid-cols-2 justify-items-center gap-4;
	}
	.allocations {
		@apply flex justify-center items-center;
	}
	th,
	td {
		@apply px-2 py-3 text-justify;
	}

	.tr--account {
		@apply font-bold;
	}

	.td--right {
		@apply text-right;
	}
</style>
