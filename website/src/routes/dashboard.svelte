<script>
	import { convertUIntToPercentage, getAllocationsByAccount } from '../../../sdk';
	import { account, getAccount, getSigner } from '$lib/modules/wallet';
	import { getTokenAddresses, isThereSomethingToClaimForAccount, claimBatch } from '../../../sdk';
	import { variables } from '$lib/modules/variables';

	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
	import Loading from '$lib/components/Loading.svelte';

	let getAllocationsByAccountPromise;
	let allocations;
	let allocationsAdditionalInfo = [];
	$: {
		if ($account) {
			updateData();
		}
	}

	async function updateData() {
		getAllocationsByAccountPromise = getAllocationsByAccount(
			fetch,
			variables.THEGRAPH_URL,
			getAccount()
		);
		allocations = await getAllocationsByAccountPromise;
		let allocationsInfoFromContract = [];

		for (let alloc of allocations) {
			const tokenAddresses = getTokenAddresses(alloc.splitter);
			const isThereSomethingToClaim = await isThereSomethingToClaimForAccount(
				alloc.splitter.id,
				$account,
				alloc.allocation,
				tokenAddresses,
				await getSigner()
			);

			allocationsInfoFromContract.push({
				tokenAddresses,
				isThereSomethingToClaim
			});
		}
		allocationsAdditionalInfo = [...allocationsInfoFromContract];
	}

	async function onClaimAll(allocation) {
		try {
			await claimBatch($account, allocation.splitter, await getSigner());
		} catch (err) {
			console.error(err);
			if (err?.data?.message) {
				alert(`Failed to claim ETH: \n\n${err.message} \n${err.data.message}`);
			} else {
				alert(`Failed to claim ETH: \n\n${err.message}`);
			}
		}
		// alert(collab.splitter.name);
	}
</script>

<main>
	<div class="wrapper">
		<h1>Dashboard</h1>

		<OnlyConnected>
			{#await getAllocationsByAccountPromise}
				<div class="loading">
					<Loading>
						<p>Loading...</p>
					</Loading>
				</div>
			{:then}
				{#if allocations?.length > 0 && allocationsAdditionalInfo.length > 0}
					<table>
						<thead>
							<tr>
								<th>Splitter Name</th>
								<th>My Percentage</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{#each allocations as allocation, index}
								<tr>
									<td>{allocation.splitter.name}</td>
									<td>{convertUIntToPercentage(allocation.allocation)}%</td>

									<td class="actions">
										<a href="/collab/{allocation.splitter.id}">See details</a>
										<button
											on:click={onClaimAll(allocation)}
											class="actions__claim"
											disabled={!allocationsAdditionalInfo[index]?.isThereSomethingToClaim}
											>Claim</button
										>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{:else}
					No collaboration yet !
				{/if}
			{:catch error}
				<p>Something went wrong: {error.message}</p>
			{/await}
		</OnlyConnected>
	</div>
</main>

<style lang="postcss">
	main {
		@apply container mx-auto px-2;
	}
	.wrapper {
		@apply flex flex-col justify-center;
	}
	h1 {
		@apply text-center text-2xl my-8;
	}
	h2 {
		@apply text-xl my-4;
	}

	table {
		@apply text-center;
	}

	.actions {
		@apply py-2;
		@apply flex flex-row space-x-3 justify-center;
	}

	table a {
		@apply bg-blue-600 rounded px-2 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 font-bold;
		text-decoration: none;
	}
	.actions__claim {
		@apply bg-green-600 hover:bg-green-700 focus:ring-green-600;
	}
</style>
