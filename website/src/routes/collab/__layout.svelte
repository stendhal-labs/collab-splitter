<script>
	import OnlyKnownNetwork from '$lib/components/Network/OnlyKnownNetwork.svelte';
	import OnlyConnected from '$lib/components/OnlyConnected.svelte';
</script>

<main>
	<OnlyConnected>
		<OnlyKnownNetwork>
			<slot />
		</OnlyKnownNetwork>
	</OnlyConnected>
</main>

<style lang="postcss">
	main {
		@apply py-8;
	}
</style>
