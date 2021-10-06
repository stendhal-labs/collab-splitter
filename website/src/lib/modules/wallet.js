import { get, writable } from 'svelte/store';
import { connectWallet } from './provider';

export const ethereumProvider = writable(null);
export const signer = writable(null);
export const provider = writable(null);
export const chainId = writable(null);
export const connected = writable(false);
export const account = writable(null);

ethereumProvider.subscribe((value) => {
	if (value) {
		value.on('accountsChanged', handleAccountsChanged);
		value.on('chainChanged', handleChainChanged);
	}
});

signer.subscribe((value) => {
	if (value) {
		connected.set(true);
	} else {
		connected.set(false);
		account.set(null);
	}
});

export async function connect() {
	const instances = await connectWallet();
	provider.set(instances.provider);
	ethereumProvider.set(instances.ethereumProvider);

	handleChainChanged(instances.ethereumProvider.chainId);
	handleAccountsChanged();
}

// on account change
async function handleAccountsChanged() {
	// set account before signer as OnlyConnected render based on signer
	const address = await getProvider().getSigner().getAddress();
	account.set(address.toLowerCase());
	signer.set(getProvider().getSigner());
}

function handleChainChanged(_chainId) {
	chainId.set(_chainId);
}

export function getAccount() {
	return get(account);
}

export function getSigner() {
	return get(signer);
}

export function getEthereumProvider() {
	return get(ethereumProvider);
}

export function getProvider() {
	return get(provider);
}
