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
        <ul class="menu__primary">
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
        <div class="menu__secondary">
          <a href="/dashboard/">
            {shortenAddress(address)}
          </a>
          <ul class="menu__sub">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/">Create</a></li>
          </ul>
        </div>
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
    border-bottom: 1px solid var(--primary);
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

  .menu__primary [aria-current] {
    font-family: silkabold;
    position: relative;
  }

  .menu__primary [aria-current]::after {
    content: '';
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    height: 4px;
    border: 1px solid var(--primary);
  }

  .connect {
    @apply font-bold px-6 py-2;
    color: var(--secondary);
    background: var(--primary);
  }

  .menu__secondary {
    position: relative;
    height: 100%;
    @apply flex flex-col justify-center;
  }

  .menu__sub {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--primary);
    color: var(--secondary);
  }

  .menu__secondary:hover .menu__sub {
    display: block;
  }

  .menu__sub li a {
    display: block;
    @apply py-4 px-8 font-bold;
    opacity: 0.8;
    border-bottom: 1px solid var(--secondary);
  }

  .menu__sub li:hover a {
    opacity: 1;
    /* @apply bg-blue-600; */
    /* color: var(--primary); */
  }
</style>
