<script>
</script>

<footer>
	<div class="footer__brand">
		<p>
			Made by <a href="https://stendhal.ai" rel="external noopener" target="_blank">Stendhal</a>
			for
			<a href="https://wallkanda.art" rel="external noopener" target="_blank">Wallkanda</a> and the creative
			web3 space.
		</p>
	</div>
	<div class="footer__socials">
		<a
			href="https://github.com/stendhal-labs/collab-splitter"
			rel="external noopener"
			target="_blank"
		>
			<svg style="width: 24px; height: 24px; fill: var(--primary);"
				><use xlink:href="#github" /></svg
			>
		</a>
		<a
			href="https://github.com/stendhal-labs/collab-splitter/blob/main/LICENSE"
			rel="external noopener"
			target="_blank">License</a
		>
	</div>
</footer>

<style lang="postcss">
	footer {
		@apply text-center py-12 flex flex-col gap-4 justify-center mt-12;
		border-top: 1px solid var(--whitey);
		z-index: 100;
		width: 100%;
	}

	.footer__socials {
		@apply flex flex-row gap-4 justify-center items-center;
	}
</style>
