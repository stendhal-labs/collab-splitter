import * as ethers from 'ethers';
import { BigNumber } from 'ethers';
import {
	create,
	getTokenAddresses,
	getTotalReceived,
	getAlreadyClaimed,
	isThereSomethingToClaim,
	getBatchClaimable,
	claimETH,
	claimERC20,
	claimBatch,
	isThereSomethingToClaimForAccount
} from '../../src/modules/collaboration';
import { abi as factoryABI } from '../../src/data/abis/factory';
import { abi as splitterABI } from '../../src/data/abis/splitter';
import { anything, mock, resetMocks } from 'depay-web3-mock';
import { FACTORY_ADDRESS_RINKEBY } from '../../src/main';

beforeAll(() => {
	process.env = {
		FACTORY_ADDRESS: '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B'
	};
});
afterAll(() => {
	resetMocks();
});

let blockchain = 'ethereum';
let accounts = [
	'0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
	'0x7642be7ccd476c76a0b49c4c631bd9a403df3e83'
];
let percents = [4900, 5100];
let erc20Addresses = ['0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'];
beforeEach(resetMocks);
beforeEach(() => mock({ blockchain, accounts: { return: accounts } }));

describe('create()', () => {
	it('create collab splitter', async () => {
		// Arrange
		const name = 'Test';
		const recipients = [
			{ account: '0xD53ADeC981F32482cb8bbDb733791EA41DD64F74', percent: 5100 },
			{ account: '0x7642BE7ccd476c76a0b49c4c631bd9A403dF3E83', percent: 4900 }
		];
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();

		// Act
		let callMock = mock({
			blockchain,
			transaction: {
				to: process.env.FACTORY_ADDRESS,
				api: factoryABI,
				method: 'createSplitter',
				return: '0x123'
			}
		});
		const result = await create(name, recipients, signer, FACTORY_ADDRESS_RINKEBY);

		//Assert
		// only test that call doesn't throw error, contracts tests are done in /contracts/test
		expect(result).toBeDefined();
		expect(callMock).toHaveBeenCalled();
	});
});

describe('getTotalReceived()', () => {
	it('received 0 ETH', async () => {
		// Arrange
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();

		// Act
		let callMock = mock({
			blockchain,
			call: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'totalReceived',
				return: '0'
			}
		});
		const result = await getTotalReceived('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', signer);

		//Assert
		// only test that call doesn't throw error, contracts tests are done in /contracts/test
		expect(result).toEqual(BigNumber.from(0));
		expect(callMock).toHaveBeenCalled();
	});
});

describe('isThereSomethingToClaimForAccount()', () => {
	it('account with ETH to claim', async () => {
		// Arrange
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();

		// Act
		let callMockEth = mock({
			blockchain,
			call: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'getBatchClaimableETH',
				params: [[accounts[0]], [percents[0]]],
				return: ['1000000000000000000', '0']
			}
		});
		const result = await isThereSomethingToClaimForAccount(
			'0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
			accounts[0],
			percents[0],
			[],
			signer
		);

		//Assert
		// only test that call doesn't throw error, contracts tests are done in /contracts/test
		expect(result).toBeTruthy();
		expect(callMockEth).toHaveBeenCalled();
	});
});

describe('getBatchClaimable()', () => {
	it('2 accounts, some eth, 1 erc20', async () => {
		// Arrange
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();

		// Act
		let callMockEth = mock({
			blockchain,
			call: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'getBatchClaimableETH',
				params: [accounts, percents],
				return: ['1000000000000000000', '0']
			}
		});
		let callMockERC20 = mock({
			blockchain,
			call: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'getBatchClaimableERC20',
				params: [accounts, percents, erc20Addresses[0]],
				return: ['2000000000000000000', '0']
			}
		});
		const result = await getBatchClaimable(
			'0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
			accounts,
			percents,
			erc20Addresses,
			signer
		);

		//Assert
		expect(result.eth[0]).toEqual(BigNumber.from('1000000000000000000'));
		expect(result.eth[1]).toEqual(BigNumber.from('0'));
		expect(result.erc20[0]).toEqual([BigNumber.from('2000000000000000000')]);
		expect(result.erc20[1]).toEqual([BigNumber.from('0')]);
		expect(callMockEth).toHaveBeenCalled();
		expect(callMockERC20).toHaveBeenCalled();
	});
});

describe('getAlreadyClaimed()', () => {
	// it('some eth no erc20', async () => {});
	it('some eth some erc20', async () => {
		// Arrange
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();

		// Act
		let callMockEth = mock({
			blockchain,
			call: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'alreadyClaimed',
				params: accounts[0],
				return: '1000000000000000000'
			}
		});
		let callMockERC20 = mock({
			blockchain,
			call: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'getBatchClaimed',
				params: [accounts[0], erc20Addresses],
				return: ['2000000000000000000']
			}
		});
		const result = await getAlreadyClaimed(
			'0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
			accounts[0],
			erc20Addresses,
			signer
		);

		//Assert
		expect(result.eth).toEqual(BigNumber.from('1000000000000000000'));
		expect(result.erc20[0]).toEqual(BigNumber.from('2000000000000000000'));
		expect(callMockEth).toHaveBeenCalled();
		expect(callMockERC20).toHaveBeenCalled();
	});
});

describe('claimBatch()', () => {
	it('no collab', async () => {
		expect(async () => {
			await claimBatch(accounts[0], undefined, null);
		}).rejects.toThrow('Invalid parameter');
	});
	it('claim eth & erc20', async () => {
		// Arrange
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();
		let collab = {
			id: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
			allocations: [
				{
					recipient: { id: accounts[0] },
					allocation: percents[0]
				},
				{
					recipient: { id: accounts[1] },
					allocation: percents[1]
				}
			],
			tokens: [
				{
					token: {
						id: erc20Addresses[0]
					}
				}
			]
		};

		// Act
		let callMock = mock({
			blockchain,
			transaction: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'claimBatch'
			}
		});
		const result = await claimBatch(accounts[0], collab, signer);

		//Assert
		// only test that call doesn't throw error, contracts tests are done in /contracts/test
		expect(result).toBeDefined();
		expect(callMock).toHaveBeenCalled();
	});
});
describe('claimETH()', () => {
	it('no collab', async () => {
		expect(async () => {
			await claimETH(accounts[0], undefined, null);
		}).rejects.toThrow('Invalid parameter');
	});
	it('claim eth', async () => {
		// Arrange
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();
		let collab = {
			id: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
			allocations: [
				{
					recipient: { id: accounts[0] },
					allocation: percents[0]
				},
				{
					recipient: { id: accounts[1] },
					allocation: percents[1]
				}
			]
		};

		// Act
		let callMock = mock({
			blockchain,
			transaction: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'claimETH'
			}
		});
		const result = await claimETH(accounts[0], collab, signer);

		//Assert
		// only test that call doesn't throw error, contracts tests are done in /contracts/test
		expect(result).toBeDefined();
		expect(callMock).toHaveBeenCalled();
	});
});
describe('claimERC20()', () => {
	it('no collab', async () => {
		expect(async () => {
			await claimERC20(accounts[0], undefined, erc20Addresses[0], null);
		}).rejects.toThrow('Invalid parameter');
	});
	it('claim erc20', async () => {
		// Arrange
		let provider = new ethers.providers.Web3Provider(global.ethereum);
		let signer = provider.getSigner();
		let collab = {
			id: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
			allocations: [
				{
					recipient: { id: accounts[0] },
					allocation: percents[0]
				},
				{
					recipient: { id: accounts[1] },
					allocation: percents[1]
				}
			]
		};

		// Act
		let callMock = mock({
			blockchain,
			transaction: {
				to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
				api: splitterABI,
				method: 'claimERC20'
			}
		});
		const result = await claimERC20(accounts[0], collab, erc20Addresses[0], signer);

		//Assert
		// only test that call doesn't throw error, contracts tests are done in /contracts/test
		expect(result).toBeDefined();
		expect(callMock).toHaveBeenCalled();
	});
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
