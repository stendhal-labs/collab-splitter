let ethereumProvider = null;
let signer = null;
let provider = null;

export async function connectWallet() {
	ethereumProvider = window.ethereum;
	if (!ethereumProvider) {
		throw new Error('No ethereum provider.');
	}

	await ethereumProvider
		.request({ method: 'eth_requestAccounts' });

	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	provider = new ethers.providers.Web3Provider(ethereumProvider);

	return { provider, ethereumProvider };
}
