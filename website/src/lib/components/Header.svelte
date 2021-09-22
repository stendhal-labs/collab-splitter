<script>
  import { page } from '$app/stores';
  import { connect, connected, signer } from '$lib/modules/wallet';
  import { shortenAddress } from '$lib/utils/utils';

  $: segment = $page.path;
</script>

<div class="header__container">
  <header>
    <div>
      <a
        sveltekit:prefetch
        href="/"
        aria-current={segment === '/' ? true : undefined}
        ><b>Collab splitter</b>
      </a>
      <nav>
        <ul>
          <li>
            <a
              rel="external noopener"
              href="https://github.com/stendhal-labs/collab-splitter-website"
              >Docs</a
            >
          </li>
        </ul>
      </nav>
    </div>
    {#if !$connected}
      <button type="button" class="connect" on:click={connect}>Connect</button>
    {:else}
      {#await $signer.getAddress() then address}
        {shortenAddress(address)}
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
    border-bottom: 1px solid var(--whitey);
    z-index: 100;
    width: 100%;
  }

  div {
    @apply flex flex-row;
  }

  ul {
    @apply flex flex-col sm:flex-row;
  }

  nav {
    margin-left: 70px;
  }

  ul [aria-current] {
    font-family: silkabold;
    position: relative;
  }

  ul [aria-current]::after {
    content: '';
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    height: 4px;
    border: 1px solid var(--whitey);
  }

  .connect {
    @apply font-bold px-6 py-2;
    color: var(--black);
    background: var(--whitey);
  }
</style>
