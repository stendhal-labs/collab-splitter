<script>
	import { page } from '$app/stores';
	import { currentNetwork } from '$lib/modules/network';
	import { connect, connected, signer } from '$lib/modules/wallet';
	import { shortenAddress } from '$lib/utils/utils';

	$: segment = $page.path;
</script>

<div class="header__container">
	<header>
		<div class="left-side">
			<a sveltekit:prefetch href="/" aria-current={segment === '/' ? true : undefined}
				><b>Collab splitter</b>
			</a>
			<nav>
				<ul class="menu__primary">
					<li>
						<a
							href="https://github.com/stendhal-labs/collab-splitter#readme"
							rel="external noopener"
							target="_blank">Docs</a
						>
					</li>
				</ul>
			</nav>
		</div>
		{#if !$connected}
			<button type="button" class="connect" on:click={connect}>Connect</button>
		{:else}
			{#await $signer.getAddress() then address}
				<div class="menu__secondary">
					<a class="user__wrapper" href="/dashboard/">
						<div class="icon__wrapper">
							<svg class="icon"><use xlink:href="#{$currentNetwork.name.toLowerCase()}" /></svg>
						</div>
						<span>
							{shortenAddress(address)}
						</span>
					</a>
					<ul class="menu__sub">
						<li><a href="/dashboard">Dashboard</a></li>
						<li><a href="/#create">Create</a></li>
					</ul>
				</div>
			{/await}
		{/if}
	</header>
</div>

<style lang="postcss">
	.header__container {
		@apply container relative mx-auto px-2;
	}

	header {
		@apply flex flex-row items-center justify-between h-20;
		border-bottom: 1px solid var(--primary);
		z-index: 100;
		width: 100%;
	}

	div {
		@apply flex flex-row gap-6;
	}

	ul {
		@apply flex flex-col sm:flex-row gap-3;
	}

	nav li a {
		position: relative;
	}

	nav li a:hover::after {
		content: '';
		position: absolute;
		top: calc(100% + 5px);
		left: 0;
		width: 100%;
		height: 4px;
		border: 1px solid var(--primary);
	}

	.connect {
		@apply font-bold px-6 py-2;
		color: var(--secondary);
		background: var(--primary);
	}

	.menu__secondary {
		position: relative;
		height: 100%;
		@apply flex flex-col justify-center;
	}

	.menu__sub {
		display: none;
		position: absolute;
		top: 100%;
		width: 100%;
		right: 0;
		background-color: var(--primary);
		color: var(--secondary);
	}

	.menu__secondary:hover .menu__sub {
		display: block;
	}

	.menu__sub li a {
		display: block;
		@apply py-4 px-8 font-bold;
		opacity: 0.8;
		border-bottom: 1px solid var(--secondary);
	}

	.menu__sub li:hover a {
		opacity: 1;
		/* @apply bg-blue-600; */
		/* color: var(--primary); */
	}

	a {
		text-decoration: none;
	}

	.user__wrapper {
		@apply flex flex-row items-center justify-end gap-4;
		@apply py-2 px-4;
		border-radius: 8px;
		background-color: var(--primary);
		color: var(--secondary);
	}

	.icon__wrapper {
		@apply flex flex-row items-center justify-center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(to bottom right, var(--secondary-25) 0%, var(--primary) 100%);
	}

	svg.icon {
		width: 24px;
		height: 24px;
	}
</style>
