export function shortenAddress(addr: string): string {
	return addr.substr(0, 6) + '...' + addr.substr(-3);
}

export function convertBigIntToPercentage(bigint: number): number {
	return bigint * 10e-3;
}

export function convertPercentageToSolidityUint(percentage: number): number {
	return Math.floor(percentage * 10e2);
}
