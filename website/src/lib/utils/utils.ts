export function shortenAddress(addr: string): string {
	return addr.substr(0, 6) + '...' + addr.substr(-3);
}