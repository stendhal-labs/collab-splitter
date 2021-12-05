<script>
	import { Modals } from 'yasp-modals';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '../app.postcss';
	import { chainId } from '$lib/modules/wallet';
	import { currentNetwork, getNetwork } from '$lib/modules/network';
	import SvGs from '$lib/components/SVGs.svelte';

	// whenever chainId changes, currentNetwork will change
	// then some part of the website will only be shown if currentNetwork is known and supported
	chainId.subscribe((value) => {
		const newNetwork = getNetwork(value);
		if ($currentNetwork && newNetwork != $currentNetwork) {
			window.location.reload();
		} else if (newNetwork != $currentNetwork) {
			$currentNetwork = newNetwork;
		}
	});
</script>

<Header />
<slot />
<Footer />

<Modals />
<SvGs />
