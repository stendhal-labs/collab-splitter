<script>
  import Form from "$lib/components/Form.svelte";
  import { copyToClipBoard } from "$lib/utils/clipboard";

  let splitterAddress = "";

  function handleSplitter(event) {
    splitterAddress = event.detail.address;
  }

  function copySplitterAddress() {
    copyToClipBoard(splitterAddress);
    alert(
      `Copied collaboration splitter smartcontract address: ${splitterAddress} !`
    );
  }
</script>

<main>
  <div class="wrapper">
    <h1>Collaboration Splitter</h1>
    <p>
      Collaboration Splitter allows to create a cheap contract in charge of
      receiving and splitting Ethereum and ERC20 payments. It can be used to
      split earnings from artworks sales if multiple artists were involved or as
      the recipient of royalties compatible with the new <a
        href="https://eips.ethereum.org/EIPS/eip-2981"
        >EIP-2981: NFT Royalty Standard</a
      >.
    </p>

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
  main {
    @apply container mx-auto px-2;
  }
  .wrapper {
    @apply flex flex-col justify-center;
  }
  h1 {
    @apply text-center text-2xl my-8;
  }
  h2 {
    @apply text-xl my-4;
  }
  .create {
    @apply flex flex-col items-center mt-16;
  }
  .generated {
    @apply flex md:flex-row flex-col space-x-4 mt-8;
  }

  a {
    text-decoration: underline;
  }
</style>
