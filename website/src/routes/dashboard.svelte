<script>
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
	import { convertBigIntToPercentage } from '$lib/utils/utils';
	import { getCollabsByAccount } from '$lib/modules/graph';
	import { getAccount } from '$lib/modules/wallet';
</script>

<main>
	<div class="wrapper">
		<h1>Dashboard</h1>

		<OnlyConnected>
			{#await getCollabsByAccount(fetch, getAccount()) then collabs}
				{#if collabs.length > 0}
					<table>
						<thead>
							<tr>
								<th>Splitter Name</th>
								<th>My Percentage</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{#each collabs as collab}
								<td>{collab.splitter.name}</td>
								<td>{convertBigIntToPercentage(collab.allocation)}%</td>

								<td><a href="/collab/{collab.splitter.id}">See details </a></td>
							{/each}
						</tbody>
					</table>
				{:else}
					No collaboration yet !
				{/if}
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

	table a {
		@apply bg-blue-600 rounded px-2 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 font-bold;
		text-decoration: none;
	}
</style>
