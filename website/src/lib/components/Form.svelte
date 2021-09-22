<script lang="ts">
  import { Recipient } from '$lib/modules/Recipient';
  import { connected } from '$lib/modules/wallet';
  import { createEventDispatcher } from 'svelte';
  import OnlyConnected from './OnlyConnected.svelte';

  const dispatch = createEventDispatcher();

  let name;
  let recipients: Recipient[] = [new Recipient(undefined, 0)];

  $: sum = recipients.reduce((acc, recipient) => acc + recipient.percentage, 0);
  $: invalidRecipients = recipients.filter((r) => !isAddressValid(r.address));
  $: recipientsWithAllocation = recipients.filter((r) => r.percentage !== 0);

  $: canSubmit =
    $connected &&
    sum == 100 &&
    invalidRecipients.length == 0 &&
    recipientsWithAllocation.length > 1;

  function isAddressValid(address = '') {
    try {
      return ethers.utils.getAddress(address.toLowerCase());
    } catch (e) {
      return false;
    }
  }

  function onSubmit() {
    const noAllocation = recipients.filter((r) => r.percentage == 0);
    if (
      !noAllocation.length ||
      confirm('Some recipients do not have any allocation. Are you sure?')
    ) {
      dispatch('splitter', {
        address: '0xC17221a1Ba66BeB0c0721d70bD96cd0f0281F56A',
      });
    }
  }

  function addLine() {
    console.log(`add line to existing size ${recipients.length}`);
    recipients = [...recipients, new Recipient(undefined, 0)];
  }

  function removeLine(index: number) {
    recipients.splice(index, 1);
    recipients = [...recipients];
  }
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
                bind:value={recipient.address}
              />
            </td>
            <td class="form__recipients__row__allocation">
              <input
                type="number"
                name="Percentage"
                id="split-{index}"
                min="0"
                max="100"
                step="0.01"
                placeholder="3.14"
                bind:value={recipient.percentage}
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
    <button on:click={onSubmit} disabled={!canSubmit} class="form__create"
      >Create</button
    >
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
    color: var(--black);
  }
</style>
