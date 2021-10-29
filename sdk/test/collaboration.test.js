import * as ethers from 'ethers';
import { BigNumber } from 'ethers';
import { create, getTokenAddresses, isThereSomethingToClaim } from '../src/collaboration';

describe('create()', () => {
	it('create collab splitter', async () => {
		// Arrange
		const name = 'Test';
		const recipients = [
			{ account: '0xD53ADeC981F32482cb8bbDb733791EA41DD64F74', percent: 5100 },
			{ account: '0x7642BE7ccd476c76a0b49c4c631bd9A403dF3E83', percent: 4900 }
		];
		const signer = null;
		// Act
		const result = await create(name, recipients, signer);

		//Assert
		expect(result).toEqual(['0x123', '0x456']);
	});
});

describe('getBatchClaimable()', () => {
	it('1 account, some eth no erc20', async () => {});
	it('1 account, some eth some erc20', async () => {});
	it('1+ account, some eth no erc20', async () => {});
});

describe('getAlreadyClaimed()', () => {
	it('some eth no erc20', async () => {});
	it('some eth some erc20', async () => {});
});

describe('claimBatch()', () => {
	it('no account', async () => {});
	it('no collab', async () => {});
	it('claim eth & erc20', async () => {});
});
describe('claimETH()', () => {
	it('no account', async () => {});
	it('no collab', async () => {});
	it('claim eth', async () => {});
});
describe('claimERC20()', () => {
	it('no account', async () => {});
	it('no collab', async () => {});
	it('no tokenAddress', async () => {});
	it('claim erc20', async () => {});
});

describe('utils', () => {
	it('getTokenAddresses()', () => {
		// Arrange
		const theGraphCollab = {
			tokens: [
				{
					token: {
						id: '0x123'
					}
				},
				{
					token: {
						id: '0x456'
					}
				}
			]
		};
		// Act
		const result = getTokenAddresses(theGraphCollab);

		//Assert
		expect(result).toEqual(['0x123', '0x456']);
	});
});
describe('isThereSomethingToClaim()', () => {
	it('Some eth to claim, no ERC20', () => {
		// Arrange
		const claimable = {
			eth: BigNumber.from('1252500000000000000')
		};
		// Act
		const result = isThereSomethingToClaim(claimable);

		//Assert
		expect(result).toBeTruthy();
	});
	it('0 eth to claim, no ERC20', () => {
		// Arrange
		const claimable = {
			eth: BigNumber.from('0')
		};
		// Act
		const result = isThereSomethingToClaim(claimable);

		//Assert
		expect(result).toBeFalsy();
	});
	it('0 eth & 0 of 1 ERC20 to claim', () => {
		// Arrange
		const claimable = {
			eth: BigNumber.from('0'),
			erc20: [BigNumber.from('0')]
		};
		// Act
		const result = isThereSomethingToClaim(claimable);

		//Assert
		expect(result).toBeFalsy();
	});
	it('Some eth & ERC20 to claim', () => {
		// Arrange
		const claimable = {
			eth: BigNumber.from('1252500000000000000'),
			erc20: [BigNumber.from('2500000000000000'), BigNumber.from('3900000000000000')]
		};
		// Act
		const result = isThereSomethingToClaim(claimable);

		//Assert
		expect(result).toBeTruthy();
	});
	it('0 eth & some ERC20 to claim', () => {
		// Arrange
		const claimable = {
			eth: BigNumber.from('0'),
			erc20: [BigNumber.from('2500000000000000'), BigNumber.from('3900000000000000')]
		};
		// Act
		const result = isThereSomethingToClaim(claimable);

		//Assert
		expect(result).toBeTruthy();
	});
});
