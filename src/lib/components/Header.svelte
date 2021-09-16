<script>
  import { page } from "$app/stores";

  $: segment = $page.path;

  function connect() {
    alert("Connect to web3");
  }
</script>

<div class="header__container">
  <header>
    <div>
      <a
        sveltekit:prefetch
        href="/"
        aria-current={segment === "/" ? true : undefined}
        ><b>Collab splitter</b>
      </a>
      <nav>
        <ul>
          <li>
            <a
              sveltekit:prefetch
              href="/docs"
              aria-current={segment.startsWith("/docs") ? true : undefined}
              >Docs</a
            >
          </li>
        </ul>
      </nav>
    </div>
    <button type="button" class="connect" on:click={connect}>Connect</button>
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
    content: "";
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
