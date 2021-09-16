<script lang="ts">
  import { Recipient } from "$lib/modules/Recipient";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let name;
  let recipients: Recipient[] = [new Recipient(undefined, 0)];

  $: sum = recipients.reduce((acc, recipient) => acc + recipient.percentage, 0);

  function onSubmit() {
    console.log(name);
    console.log(recipients);
    console.log(sum);
    dispatch("splitter", {
      address: "0xC17221a1Ba66BeB0c0721d70bD96cd0f0281F56A",
    });
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

<form on:submit|preventDefault={onSubmit}>
  <div class="form__name">
    <label for="name">Splitter name (for readability purposes)</label>
    <input type="text" bind:value={name} id="name" />
  </div>
  <div class="form__recipients">
    {#each recipients as recipient, index}
      <fieldset>
        <label for="recipient-{index}">Recipient #{index}</label>
        <input
          type="text"
          id="recipient-{index}"
          placeholder="0x123456789"
          title="Must be an ETH address"
          bind:value={recipient.address}
        />

        <!-- pattern="0x[sum-fA-F0-9]{40}$" -->
        <p>-</p>
        <input
          type="number"
          name="Percentage"
          id="split-{index}"
          min="0"
          max="100"
          step="0.01"
          placeholder="3.14"
          bind:value={recipient.percentage}
        />
        <label for="split">%</label>

        <button
          type="button"
          on:click={() => removeLine(index)}
          class="form__recipient__remove">Remove</button
        >
      </fieldset>
    {/each}
  </div>
  <button class="form__add" type="button" on:click={addLine}
    >Add recipient</button
  >
  <p class="form__total">
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

  <button type="submit" class="form__create">Create</button>
</form>

<style lang="postcss">
  .form__name {
    @apply flex md:flex-row flex-col justify-between mt-4;
  }
  .form__recipients {
    @apply mt-4;
  }

  fieldset {
    @apply flex md:flex-row flex-col space-x-4 justify-items-center items-center;
    @apply mt-4;
  }

  .form__recipient__remove {
    @apply ml-6 rounded px-2 py-1;
  }

  .form__add {
    @apply rounded px-2 py-1 mt-4 justify-center;
  }

  .form__error {
    @apply text-red-400;
  }

  .form__total {
    @apply mt-4;
  }

  .form__create {
    @apply w-full rounded py-2 mt-4 font-bold;
  }

  input {
    @apply px-1 py-1;
    color: var(--black);
  }

  button {
    @apply bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50;
  }
</style>
