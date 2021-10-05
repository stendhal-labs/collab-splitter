<script context="module">
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

<script>
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
	import { convertBigIntToPercentage } from '$lib/utils/utils';
	import { getAccount } from '$lib/modules/wallet';

	export let collab;

	$: canClaim = collab?.allocations.find((a) => getAccount() === a.recipient.id);
</script>

<main>
	{#if collab}
		<h1>{collab.name || ''}</h1>

		<OnlyConnected>
			<div class="actions">
				{#if canClaim}
					<button>Claim</button>
				{:else}
					You are not one of the recipient of this contract.
				{/if}
			</div>
		</OnlyConnected>

		<h2>Contract:</h2>
		<a href="{import.meta.env.VITE_EXPLORER_URL}/address/{collab.id}">{collab.id || ''}</a>

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
					{#each collab.allocations as allocation}
						<tr>
							{#if allocation.recipient.id === getAccount()}
								<td>
									<b>{allocation.recipient.id}</b>
								</td>
								<td class="allocation__percentage"
									><b>{convertBigIntToPercentage(allocation.allocation)}%</b>
								</td>
							{:else}
								<td>
									{allocation.recipient.id}
								</td>
								<td class="allocation__percentage"
									>{convertBigIntToPercentage(allocation.allocation)}%</td
								>
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
		@apply flex justify-center mt-8;
	}

	.allocations {
		@apply flex justify-center items-center;
	}
	th,
	td {
		@apply px-2 py-3 text-justify;
	}

	.allocation__percentage {
		@apply text-right;
	}
</style>
