export function shortenAddress(addr: string): string {
	return addr.substr(0, 6) + '...' + addr.substr(-3);
}

export function convertBigIntToPercentage(bigint: number): number {
	return bigint * 1e-2;
}

export function convertPercentageToSolidityUint(percentage: number): number {
	return Math.floor(percentage * 1e2);
}
