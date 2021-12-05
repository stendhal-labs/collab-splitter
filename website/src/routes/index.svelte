<script>
	import Form from '$lib/components/Form.svelte';
	import { copyToClipBoard } from '$lib/utils/clipboard';

	let splitterAddress = '';

	function handleSplitter(event) {
		splitterAddress = event.detail.address;
		copyToClipBoard(splitterAddress);
		alert(
			`Collaboration splitter contract successfully created 🤖 !!!\nThank you for using collab splitter.\n\n${splitterAddress}\n(copied to clipboard)`
		);
	}

	function copySplitterAddress() {
		copyToClipBoard(splitterAddress);
		alert(`Copied smart contract's address: ${splitterAddress} !`);
	}
</script>

<main>
	<div class="wrapper">
		<h1>Collaboration Splitter</h1>
		<header>
			<p class="headline">Cheaply and efficiently split revenues from sales and secondary sales.</p>
			<p class="small-info">
				Collaboration Splitter allows to cheaply create a contract in charge of receiving and
				splitting Ethereum and ERC20 payments.<br />It can be used to split earnings from artworks
				sales if multiple artists were involved or as the recipient of royalties compatible with the
				new
				<a target="_blank" href="https://eips.ethereum.org/EIPS/eip-2981"
					>EIP-2981: NFT Royalty Standard</a
				>.
			</p>
		</header>

		<div class="create">
			<h2>Create your collaboration splitter:</h2>
			<Form on:splitter={handleSplitter} />
			{#if splitterAddress}
				<div class="generated">
					<p>Generated address:</p>
					<p><b>{splitterAddress}</b></p>
				</div>
				<a on:click={copySplitterAddress} href="/">Copy</a>
			{/if}
		</div>
	</div>
</main>

<style lang="postcss">
	.wrapper {
		@apply flex flex-col justify-center;
	}

	header {
		@apply text-center;
	}

	.headline {
		@apply py-6 font-medium text-center;
		font-size: 120%;
	}

	.small-info {
		font-size: 75%;
	}

	.create {
		@apply flex flex-col items-center mt-16;
	}

	.generated {
		@apply flex md:flex-row flex-col space-x-4 mt-8;
	}

	p,
	.create {
		@apply max-w-screen-md mx-auto w-full;
	}

	a {
		text-decoration: underline;
	}
</style>
