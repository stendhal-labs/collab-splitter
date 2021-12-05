export function shortenAddress(addr: string): string {
	if (!addr) return '';
	return (addr.substr(0, 6) + '...' + addr.substr(-3)).toLocaleLowerCase();
}


export function isAddressValid(address = '') {
	try {
		return ethers.utils.getAddress(address);
	} catch (e) {
		return false;
	}
}