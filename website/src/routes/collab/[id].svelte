<script context="module" lang="ts">
	import { getCollab } from '$lib/modules/graph';
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

<script lang="ts">
	import sdk from '../../../../sdk/';
	import { variables } from '$lib/modules/variables';
	import { account, getSigner, provider } from '$lib/modules/wallet';
	import { convertBigIntToPercentage } from '$lib/utils/utils';

	import splitterABI from '$lib/data/abis/splitter';

	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
	import { Recipient } from '$lib/modules/Recipient';

	export let collab;

	$: myAllocation = collab?.allocations.find((a) => $account === a.recipient.id);

	const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));

	let contractBalance;
	let accountClaimable;
	let alreadyClaimed;
	let totalReceived;
	let erc20Data;

	let ethToClaim;
	$: {
		if ($account) {
			updateDataFromContract();
		}
	}

	async function updateDataFromContract() {
		contractBalance = await $provider.getBalance(collab.id);

		const contract = new ethers.Contract(collab.id, splitterABI, await getSigner());
		alreadyClaimed = await contract.alreadyClaimed($account);
		totalReceived = await contract.totalReceived();
		// erc20Data = await contract.erc20Data('XXXX');

		accountClaimable = totalReceived.mul(myAllocation.allocation).div(10e3).sub(alreadyClaimed);

		ethToClaim = await contract.getBatchClaimableETH(
			recipients.map((r) => r.account),
			recipients.map((r) => r.percent)
		);
	}

	async function onClaim() {
		// create contract
		const contract = new ethers.Contract(collab.id, splitterABI, await getSigner());

		const recipients = collab.allocations.map((a) => new Recipient(a.recipient.id, a.allocation));
		console.log(recipients);
		const accountIndex = recipients.findIndex((r) => $account === r.account);
		console.log(accountIndex);
		//claimETH
		// claimERC20

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
			.then((receipt) => receipt.events)
			.catch((err) => {
				console.error(err);
				alert(`Failed to claim ETH: \n\n${err.message} \n${err.data.message}`);
			});

		// const eventsERC20 = await contract
		// 	.claimERC20($account, myAllocation, 'merkleProof', 'token')
		// 	.then((tx) => tx.wait())
		// 	.then((receipt) => {
		// 		console.log(receipt);
		// 		return receipt;
		// 	})
		// 	.then((receipt) => receipt.events)
		// 	.catch((err) => {
		// 		console.error(err);
		// 		alert(`Failed to claim ERC20 : \n ${err.message}`);
		// 	});
	}
	async function onClaimForAll() {
		alert('Available soon...');
	}
	async function onClaimERC20() {
		alert('Available soon...');
	}
	async function onClaimERC20ForAll() {
		alert('Available soon...');
	}
</script>

<main>
	{#if collab}
		<h1>{collab.name || ''}</h1>

		<OnlyConnected>
			<div class="actions">
				{#if myAllocation}
					<div class="actions__eth">
						<button on:click={onClaim} disabled={accountClaimable && accountClaimable.lte(0)}
							>Claim {accountClaimable ? ethers.utils.formatEther(accountClaimable) : ''} ETH</button
						>

						<button on:click={onClaimForAll} disabled={contractBalance && contractBalance.lte(0)}
							>Claim ETH for all</button
						>
					</div>

					<div class="actions__erc20">
						<button on:click={onClaimERC20} disabled>Claim ERC20</button>
						<button on:click={onClaimERC20ForAll} disabled>Claim ERC20 for all</button>
						<select disabled>
							<option>wETH</option>
						</select>
					</div>
				{:else}
					You are not one of the recipient of this contract.
				{/if}
			</div>
			<h2>Balance</h2>
			<div class="balance">
				{#if contractBalance}
					<p>
						Current:
						<b>{ethers.utils.formatEther(contractBalance)}</b> ETH
					</p>
				{/if}
				{#if totalReceived}
					<p>
						Total received:
						<b>{ethers.utils.formatEther(totalReceived)}</b> ETH
					</p>
				{/if}
				{#if alreadyClaimed}
					<p>
						You already claimed:
						<b>{ethers.utils.formatEther(alreadyClaimed)}</b> ETH
					</p>
				{/if}
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
						{#if ethToClaim}
							<th>ETH to claim</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each collab.allocations as allocation, index}
						<tr class:tr--account={allocation.recipient.id === $account}>
							<td>
								{allocation.recipient.id}
							</td>
							<td class="td--right">{convertBigIntToPercentage(allocation.allocation)}%</td>
							{#if ethToClaim}
								<td class="td--right">{ethers.utils.formatEther(ethToClaim[index])}</td>
							{/if}
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
		@apply grid grid-flow-col justify-center gap-8;
	}

	.actions button {
		@apply w-full;
	}
	.actions__eth {
		@apply flex flex-col  space-y-4 items-center mt-8;
	}
	.actions__erc20 {
		@apply flex flex-col  space-y-4 items-center mt-8;
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
