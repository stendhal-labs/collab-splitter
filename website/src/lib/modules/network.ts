import { variables } from '$lib/modules/variables';

import networks from '$lib/data/networks';
import { writable } from 'svelte/store';

export const currentNetwork = writable(null);

export function getNetwork(chainId) {
	chainId = parseInt(chainId);
	return networks[chainId];
}

export function listNetworks(includePrivates = (variables.NODE_ENV == 'development')) {
	return (
		Object.keys(networks)
			.map((networkId) => {
				const network = networks[networkId];
				network.id = networkId;
				return network;
			})
			// filter on vite env
			.filter((network) => includePrivates || !network.private)
	);
}
