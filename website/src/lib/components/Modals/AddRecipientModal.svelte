<script>
	import { isAddressValid } from '$lib/utils/utils';

	import BaseModal from './BaseModal.svelte';

	export let closeModal;
	export let callback;

	let account;
	let percent;

	$: canSubmit = isAddressValid(account) && !isNaN(percent) && percent > 0 && percent < 100;

	function onAddRecipient() {
		callback({ account, percent });
		closeModal();
	}
</script>

<BaseModal canClose={false}>
	<h2 slot="header">Add recipient</h2>
	<form>
		<div class="form__space">
			<label for="recipient">Recipient </label>
			<div class="form__row">
				<input type="text" bind:value={account} placeholder="Recipient ethereum address..." />
			</div>
		</div>

		<div class="form__space">
			<label for="recipient">Allocation (in percent) </label>
			<div class="form__row">
				<input
					type="number"
					name="Percent"
					min="0"
					max="100"
					step="0.01"
					placeholder="3.14"
					bind:value={percent}
				/>
				<span>%</span>
			</div>
		</div>
	</form>
	<footer slot="footer">
		<button class="light" on:click={closeModal}>cancel</button>
		<button disabled={!canSubmit} on:click={onAddRecipient}>add recipient</button>
	</footer>
</BaseModal>

<style lang="postcss">
	h2 {
		@apply mt-4;
		@apply font-bold;
	}

	label {
		@apply font-medium;
	}

	label + input {
		@apply mt-2;
	}

	input {
		border-bottom: 1px solid var(--secondary);
	}

	.form__space {
		@apply mt-6;
	}

	.form__row {
		@apply flex flex-row gap-2 w-full;
		@apply mt-2;
	}

	.form__row input {
		flex: 1 1 0;
	}

	button {
		color: var(--primary);
	}

	footer {
		@apply py-8 flex flex-row justify-center gap-4;
	}
</style>
