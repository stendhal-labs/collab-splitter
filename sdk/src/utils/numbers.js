/**
 * Precision in Solidity contract: 10000 for 100% so multiplier is 1e2
 */
const DECIMAL_PRECISION_SCALE = 1e2;

export function convertUIntToPercentage(bigint) {
	return bigint / DECIMAL_PRECISION_SCALE;
}

export function convertPercentageToUint(percentage) {
	return Math.floor(percentage * DECIMAL_PRECISION_SCALE);
}
