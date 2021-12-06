<script>
	import { currentNetwork } from '$lib/modules/network';
	import { copyToClipBoard } from '$lib/utils/clipboard';

	import BaseModal from './BaseModal.svelte';

	export let closeModal;
	export let address;
	export let name;

	let copied = false;

	async function copy(text) {
		await copyToClipBoard(text);
		copied = true;
	}
</script>

<BaseModal canClose={false}>
	<h2 slot="header">Success</h2>
	<div class="success">
		<strong>Congratulations!</strong>
		<p>You just created your new Collab Splitter contract</p>
		<div class="info">
			<dl>
				<dt>Name</dt>
				<dd>{name}</dd>
				<dt>Address</dt>
				<dd>
					{address}
					{#if !copied}
						<button class="light" on:click={() => copy(address)}>copy</button>
					{:else}
						<span class="copied">✓ Copied</span>
					{/if}
				</dd>
				<dt>Links</dt>
				<dd>
					<div class="links">
						<a href="{$currentNetwork.explorer_url}/address/{address}" target="_blank">etherscan</a>
						<a href="/collab/{address}" on:click={closeModal}>splitter page</a>
						<a href="/dashboard" on:click={closeModal}>dashboard</a>
					</div>
				</dd>
			</dl>
		</div>
	</div>
	<footer slot="footer">
		<button class="light" on:click={closeModal}>close</button>
	</footer>
</BaseModal>

<style lang="postcss">
	h2 {
		@apply mt-4;
		@apply font-bold;
	}

	.success {
		@apply flex flex-col justify-center gap-2 text-center;
	}

	dt {
		@apply font-bold mt-4;
	}

	.links {
		@apply flex flex-col md:flex-row gap-4 items-center justify-center;
	}

	.copied {
		@apply text-blue-600;
	}

	button {
		color: var(--primary);
	}

	footer {
		@apply py-8 flex flex-row justify-center gap-4;
	}
</style>
