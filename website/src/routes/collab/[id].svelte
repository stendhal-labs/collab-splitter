<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import { currentNetwork } from '$lib/modules/network';
	import { account, getSigner, provider } from '$lib/modules/wallet';

	import { convertUIntToPercentage, getCollab } from '../../../../sdk/';

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
	import Loading from '$lib/components/Loading.svelte';

	let loading;
	let collab;
	let myAllocation;
	let recipients;
	let tokenAddresses;

	$: {
		if (collab) {
			myAllocation = collab?.allocations.find((a) => $account === a.recipient.id);
			recipients = collab?.allocations.map((a) => ({
				account: a.recipient.id,
				percent: a.allocation
			}));
			tokenAddresses = getTokenAddresses(collab);

			if ($account) {
				updateDataFromContract();
			}
		}
	}

	let contractBalance;
	let accountClaimable;
	let alreadyClaimed;
	let totalReceived;

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

	onMount(async () => {
		loading = true;
		collab = await getCollab(fetch, $currentNetwork.graph_url, $page.params.id);
		loading = false;
	});
</script>

<div class="wrapper">
	{#if loading}
		<Loading />
	{:else if collab}
		<h2>Contract:</h2>
		<div class="contract">
			<div>
				<strong>Name:</strong>
				{collab.name || ''}
			</div>
			<a href="{$currentNetwork.explorer_url}/address/{collab.id}" target="_blank"
				>{collab.id || ''}</a
			>
		</div>

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

			{#if myAllocation}
				<h3>My allocation ({convertUIntToPercentage(myAllocation.allocation)}%)</h3>
				<div class="claim-wrapper">
					<div class="claim">
						<strong>Ethereum</strong>
						<button
							on:click={onClaim}
							disabled={accountClaimable && accountClaimable.eth && accountClaimable.eth.lte(0)}
							>Claim {accountClaimable && accountClaimable.eth
								? ethers.utils.formatEther(accountClaimable.eth)
								: ''} ETH</button
						>
					</div>

					<!-- <details>
						<summary>Tokens to claim</summary> -->
					{#if collab.tokens.length > 0}
						{#each collab.tokens as token, index}
							<div class="claim">
								<strong>
									{token.token.name}
									(<a href="{$currentNetwork.explorer_url}/token/{token.token.id}"
										>{token.token.symbol.toUpperCase()}</a
									>)
								</strong>
								<button
									on:click={() => onClaimERC20(token.token.id)}
									disabled={accountClaimable?.erc20[index].lte(0)}
									>Claim {accountClaimable && accountClaimable.erc20[index]
										? accountClaimable?.erc20[index]
										: ''}
									{token.token.symbol.toUpperCase()}</button
								>
							</div>
						{/each}
					{:else}
						<p class="empty">No ERC20 tokens received.</p>
					{/if}
				</div>
			{/if}
			{#if alreadyClaimed?.eth.gt(0) || alreadyClaimed?.erc20.length}
				<div>
					<h3>History</h3>
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
				</div>
			{/if}
			<!-- </details> -->
		</div>

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
							<td class="td--right">{convertUIntToPercentage(allocation.allocation)}%</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="error">Collaboration not found 😥</p>
	{/if}
</div>

<style lang="postcss">
	.wrapper {
		@apply mx-auto;
		width: calc(100% - 1em);
		max-width: 600px;
	}

	h2 {
		@apply mt-8;
	}

	.contract,
	.empty {
		text-align: center;
	}

	.claim-erc20 {
		@apply mx-auto;
	}

	.actions {
		@apply grid justify-center gap-8 mt-8;
	}

	.actions__etherc20 {
		@apply col-span-2;
	}

	.actions button {
		@apply w-full;
	}

	.claim {
		@apply flex flex-row justify-between items-center;
	}

	.balance {
		text-align: center;
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
