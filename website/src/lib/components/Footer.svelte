<script>
</script>

<div class="footer__container">
	<footer>
		<div class="footer__brand">
			<p>
				Made by <a href="https://stendhal.ai" rel="external noopener" target="_blank">Stendhal</a>
				for street-artists on
				<a href="https://wallkanda.art" rel="external noopener" target="_blank">Wallkanda</a>
			</p>
		</div>
		<div class="footer__socials">
			<a
				href="https://github.com/stendhal-labs/collab-splitter"
				rel="external noopener"
				target="_blank">Github</a
			>, <a href="https://wallkanda.art/legal" rel="external noopener" target="_blank">Terms</a>
		</div>
	</footer>
</div>

<style lang="postcss">
	.footer__container {
		@apply container relative mx-auto px-2;
		@apply md:py-24 py-8;
	}
	footer {
		border-top: 1px solid var(--whitey);
		z-index: 100;
		width: 100%;

		@apply flex justify-between py-2;
		/* @apply grid space-x-6 lg:grid-cols-4 md:grid-cols-2 grid-cols-1; */
	}

	.footer__brand {
		@apply flex flex-col justify-between col-span-2;
		@apply lg:mr-auto lg:ml-0 mx-auto lg:text-left text-center;
	}
	.footer__socials {
		@apply flex flex-row space-x-2 mt-3;
	}
</style>
