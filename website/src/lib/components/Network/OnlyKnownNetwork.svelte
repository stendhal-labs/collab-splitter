<script>
	import { currentNetwork, listNetworks } from '$lib/modules/network';

	export let showMessage = true;
</script>

{#if !$currentNetwork}
	{#if showMessage}
		<div class="unknown">
			<h2>Unknown network.</h2>
			<p>
				This section needs access to the blockchain to work.<br />Please change network on your
				wallet for one of the following:
			</p>
			<p>
				{listNetworks()
					.map((network) => network.name)
					.join(', ')}
			</p>
		</div>
	{/if}
{:else}
	<slot />
{/if}

<style lang="postcss">
	.unknown {
		@apply text-center p-8 mx-auto m-4;
		background-color: var(--primary);
		color: var(--secondary);
		border-radius: 8px;
	}

	p {
		@apply text-center py-4;
	}
</style>
