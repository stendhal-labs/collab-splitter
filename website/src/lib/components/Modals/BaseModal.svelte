<script>
	import { fly } from 'svelte/transition';
	import { closeModal } from 'yasp-modals';

	export let transitionType = fly;
	export let transitionProps = { y: 300, duration: 500 };

	let className = '';
	export { className as class };
	let props = {};

	export let canClose = true;
	export let onClose = closeModal;

	$: {
		const { has, ...rest } = $$props;
		props = rest;
		delete props.class;
	}
</script>

<section class={`modal ${className}`} {...props} transition:transitionType={transitionProps}>
	{#if canClose}
		<div class="modal__close" role="button" on:click={onClose}>
			<img src="/images/icons/close-circle.svg" alt="close" />
		</div>
	{/if}
	<slot name="header" />
	<slot />
	<slot name="footer" />
</section>

<style lang="postcss">
	.modal {
		@apply flex flex-col;
		width: auto;
		max-width: calc(100% - 1em);
		max-height: calc(100% - 1em);
		min-width: calc(320px - 1em);
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		overflow-y: auto;

		background-color: var(--primary);
		color: var(--secondary);

		--current-color: var(--secondary);
		--current-bg: var(--primary);

		padding: 1.8rem;
		box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.44);
		border-radius: 8px;
	}

	@screen md {
		.modal {
			min-width: 630px;
		}
	}

	.modal__close {
		position: absolute;
		right: 1.8rem;
		top: 1.8rem;
	}
</style>
