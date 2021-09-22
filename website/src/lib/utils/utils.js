export function shortenAddress(addr) {
	return addr.substr(0, 6) + '...' + addr.substr(-3);
}
