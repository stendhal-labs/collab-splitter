import { convertUIntToPercentage, convertPercentageToUint } from '../../src/utils/numbers';

describe('convertUIntToPercentage()', () => {
	it('4999', () => {
		// Arrange
		const bigint = 4999;
		// Act
		const result = convertUIntToPercentage(bigint);

		// Assert
		expect(result).toEqual(49.99);
	});
	it('0', () => {
		// Arrange
		const bigint = 0;
		// Act
		const result = convertUIntToPercentage(bigint);

		// Assert
		expect(result).toEqual(0);
	});
	it('20000', () => {
		// Arrange
		const bigint = 20000;
		// Act
		const result = convertUIntToPercentage(bigint);

		// Assert
		expect(result).toEqual(200.0);
	});
});
describe('convertPercentageToUint()', () => {
	it('49.99%', () => {
		// Arrange
		const percent = 49.99;
		// Act
		const result = convertPercentageToUint(percent);

		// Assert
		expect(result).toEqual(4999);
	});
	it('0%', () => {
		// Arrange
		const percent = 0;
		// Act
		const result = convertPercentageToUint(percent);

		// Assert
		expect(result).toEqual(0);
	});
});
