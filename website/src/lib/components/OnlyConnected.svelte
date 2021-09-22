<script>
  import { connect, connected } from '$lib/modules/wallet';

  async function onConnect() {
    await connect();
  }
</script>

{#if !$connected}
  <div class="only-connected">
    <button on:click={onConnect}>Connect Wallet</button>
  </div>
{:else}
  <slot />
{/if}

<style>
  .only-connected {
    text-align: center;
  }
</style>
