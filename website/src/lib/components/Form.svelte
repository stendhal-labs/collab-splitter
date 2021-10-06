<script lang="ts">
	import { Recipient } from '$lib/modules/Recipient';
	import { connected, getSigner } from '$lib/modules/wallet';
	import { createEventDispatcher } from 'svelte';
	import OnlyConnected from './OnlyConnected.svelte';

	import sdk from '../../../../sdk/';
	import factoryABI from '$lib/data/abis/factory';
	import { convertPercentageToSolidityUint } from '$lib/utils/utils';

	const dispatch = createEventDispatcher();

	let name = '';
	let recipients: Recipient[] = [];

	let mustReset = false;

	$: sum = recipients.reduce((acc, recipient) => acc + recipient.percent, 0);
	$: invalidRecipients = recipients.filter((r) => !isAddressValid(r.account));
	$: recipientsWithAllocation = recipients.filter((r) => r.percent !== 0);

	$: canSubmit =
		$connected &&
		name.trim().length > 0 &&
		sum == 100 &&
		invalidRecipients.length == 0 &&
		recipientsWithAllocation.length > 1;

	function isAddressValid(address = '') {
		try {
			return ethers.utils.getAddress(address);
		} catch (e) {
			return false;
		}
	}

	function initRecipients() {
		//  recipients = [new Recipient(undefined, 0)];
		recipients = [
			new Recipient('0xf4274229Bee63d4A6D1Edde6919afA815F6E1a25', 10),
			new Recipient('0xF4274229bEe63d4A6D1edDE6919aFa815f6e1a24', 80)
			// new Recipient(getAccount(), 10)
		];
	}

	async function onSubmit() {
		const withAllocation = recipients
			.filter((r) => r.percent !== 0)
			.map((r) => new Recipient(r.account, convertPercentageToSolidityUint(r.percent)));
		const diff = withAllocation.length - recipients.length;

		console.log(withAllocation);

		if (
			diff == 0 ||
			confirm('Some recipients do not have any allocation and will be removed. Are you sure?')
		) {
			// calculate tree root
			const root = sdk.getRoot(withAllocation);

			console.log(import.meta.env.VITE_FACTORY_ADDRESS, factoryABI, await getSigner());
			// create contract
			const contract = new ethers.Contract(
				import.meta.env.VITE_FACTORY_ADDRESS,
				factoryABI,
				await getSigner()
			);

			console.log(convertPercentageToSolidityUint(50.5));

			// create collab splitter
			const events = await contract
				.createSplitter(
					name,
					root,
					withAllocation.map((a) => a.account),
					withAllocation.map((a) => a.percent)
				)
				.then((tx) => tx.wait())
				.then((receipt) => {
					console.log(receipt);
					return receipt;
				})
				.then((receipt) => receipt.events)
				.catch((err) => {
					console.error(err);
					alert(`Failed to create Splitter contract: \n ${err.message}`);
				});

			mustReset = true;
			dispatch('splitter', {
				address: events[0].args[0]
			});
		}
	}

	function onReset() {
		initRecipients();
		mustReset = false;
	}

	function addLine() {
		recipients = [...recipients, new Recipient(undefined, 0)];
	}

	function removeLine(index: number) {
		recipients.splice(index, 1);
		recipients = [...recipients];
	}

	initRecipients();
</script>

<form on:submit|preventDefault>
	<div class="form__group form__name">
		<label for="name"><strong>Splitter name</strong></label>
		<input
			type="text"
			bind:value={name}
			id="name"
			placeholder="Collab between dievardump, floshiii and agraignic"
		/>
	</div>
	<div class="form__group form__recipients">
		<strong>Recipients</strong>
		<table>
			<thead>
				<tr>
					<th scope="col" />
					<th scope="col">Address</th>
					<th scope="col">Allocation</th>
					<th scope="col" />
				</tr>
			</thead>
			<tbody>
				{#each recipients as recipient, index}
					<tr class="form__recipients__row">
						<td><label for="recipient-{index}">#{index + 1}</label></td>
						<td class="form__recipients__row__address">
							<input
								type="text"
								id="recipient-{index}"
								placeholder="0x123456789"
								title="Must be an ETH address"
								bind:value={recipient.account}
							/>
						</td>
						<td class="form__recipients__row__allocation">
							<input
								type="number"
								name="Percent"
								id="split-{index}"
								min="0"
								max="100"
								step="0.01"
								placeholder="3.14"
								bind:value={recipient.percent}
							/> %
						</td>
						<td>
							<button
								type="button"
								on:click={() => removeLine(index)}
								class="form__recipient__remove">Remove</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="form__group form__add">
		<button type="button" on:click={addLine}>Add recipient</button>
	</div>
	<p class="form__group form__total">
		Total: <b>{sum}%</b>
		<span class="form__error">
			{#if sum > 100}
				Error: total is greater than 100%.
			{:else if sum < 100}
				<em>
					({100 - sum}% left to split)
				</em>
			{/if}
		</span>
	</p>
	<p>
		<b>{recipients.length}</b> recipients.
	</p>

	<OnlyConnected>
		{#if !mustReset}
			<button on:click={onSubmit} disabled={!canSubmit} class="form__create">Create</button>
		{:else}
			<button on:click={onReset} class="form__create">Reset</button>
		{/if}
	</OnlyConnected>
</form>

<style lang="postcss">
	form {
		@apply max-w-screen-md w-full mx-auto;
	}

	.form__name {
		@apply flex flex-col mt-4;
	}

	table {
		border-collapse: separate;
		border-spacing: 0 0.5em;
		width: 100%;
	}

	th,
	td {
		@apply px-2;
	}

	.form__group {
		@apply py-2;
	}

	.form__name input {
		@apply mt-2;
	}

	.form__recipients {
		@apply mt-4;
	}

	.form__recipients__row {
	}

	.form__recipients__row__address input {
		width: 100%;
	}

	.form__recipients__row__allocation input {
		text-align: right;
		width: 100px;
	}

	.form__recipient__remove {
		@apply ml-6 rounded px-2 py-1;
	}

	.form__add {
		@apply text-center;
	}

	.form__error {
		@apply text-red-400;
	}

	.form__total {
		@apply mt-4;
	}

	.form__create {
		@apply w-full mt-4;
	}

	input {
		@apply px-1 py-1;
		color: var(--secondary);
	}
</style>
