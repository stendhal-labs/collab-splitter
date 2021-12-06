<script>
	import { openModal } from 'yasp-modals';
	import { copyToClipBoard } from '$lib/utils/clipboard';

	import Form from '$lib/components/Form.svelte';
	import CreationSuccessModal from '$lib/components/Modals/CreationSuccessModal.svelte';
	import { shortenAddress } from '$lib/utils/utils';

	let lastCreations = [];

	function onHandleSplitter(event) {
		const address = event.detail.address;
		const name = event.detail.name;

		openModal(CreationSuccessModal, {
			address,
			name
		});
		lastCreations.push({ name, address });
		lastCreations = lastCreations;
	}

	function copyAddress(address) {
		copyToClipBoard(address);
		alert(`Copied smart contract's address: ${address} !`);
	}
</script>

<main>
	<div class="wrapper">
		<h1>Collab-Splitter</h1>
		<header>
			<p class="headline">
				Split revenues from sales and royalties in a cheap, efficient and transparent way.
			</p>
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
		<article class="how">
			<h2>How does it work?</h2>
			<section class="cards">
				<div class="card">
					<h3>
						<span class="numbered">1</span> Create a splitter
					</h3>
					<p><a href="/#create">Create</a> a collab splitter and get a contract address</p>
				</div>
				<div class="card">
					<h3>
						<span class="numbered">2</span> Use the address
					</h3>
					<p>Use the contract address as royalties or sales revenue recipient</p>
				</div>
				<div class="card">
					<h3>
						<span class="numbered">3</span> Claim
					</h3>
					<p>Regularly claim your revenues in the <a href="/dashboard">dashboard</a></p>
				</div>
			</section>
		</article>
		<article id="create" class="create">
			<h2>Create your collab-splitter:</h2>
			<Form on:splitter={onHandleSplitter} />
			{#if lastCreations.length}
				<div class="generated">
					<p>Your creations:</p>
					<ul>
						{#each lastCreations as creation}
							<li>
								<strong>{creation.name}</strong>({shortenAddress(creation.address)})
								<button on:click={() => copyAddress(creation.address)}>Copy address</button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</article>
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

	article {
		@apply mt-8;
	}

	.create {
		@apply flex flex-col items-center;
	}

	.generated {
		@apply flex flex-col space-x-4 mt-8 text-center;
	}

	.generated li {
		@apply flex gap-4 items-center mt-3;
	}

	.cards {
		@apply grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto;
		max-width: calc(100% - 1em);
		width: 800px;
	}

	.card {
		@apply p-4;
		border: 1px solid var(--primary-10);
		border-radius: 8px;
		text-align: center;
	}

	.card h3 {
		@apply flex justify-center items-center gap-2;
	}
	.card h3::after {
		content: none;
	}

	.card p {
		@apply text-sm mt-4;
	}

	.numbered {
		@apply flex justify-center items-center text-sm;
		width: 25px;
		height: 25px;
		border: 1px solid var(--primary);
		border-radius: 50%;
	}

	p,
	.create {
		@apply max-w-screen-md mx-auto w-full;
	}

	a {
		text-decoration: underline;
	}
</style>
