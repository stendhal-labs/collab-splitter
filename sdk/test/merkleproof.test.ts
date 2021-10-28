import * as ethers from 'ethers';
import { getNode, getProof, getRoot } from '../src/merkleproof';

// bad hack as isolatedModules is enabled by tsconfig.json
export {};

describe('getNode', () => {
	it('getNode OK', () => {
		// Arrange
		const account = '0xdc58f594e82f7592163687915f61b031d2102fdb';
		const percent = 10 * 100;
		// Act

		const node = getNode(account, percent);

		//Assert
		expect(node).toBe('0xfdcc495291813e45ff9f30856c3fcadfa9bb13c64b7c008de80c9789915261df');
	});
});

describe('getRoot', () => {
	it('getRoot OK', () => {
		// Arrange
		const collab = [
			{ account: '0xD53ADeC981F32482cb8bbDb733791EA41DD64F74', percent: 1000 },
			{ account: '0x7642BE7ccd476c76a0b49c4c631bd9A403dF3E83', percent: 900 },
			{ account: '0x1ecc8e43660df8843B9172dF59367aAf18410E94', percent: 350 },
			{ account: '0xFED8706D9C6227E69e924526441043449559B249', percent: 250 },
			{ account: '0x18638D5563E763703B89c9A5171a060D420aF03E', percent: 100 },
			{ account: '0xD04634B1536C39d932FFB5Ef571f806C88a3A69C', percent: 1000 },
			{ account: '0xf33a205dCe3F05Bdd2a74875FB8E3b4A042Cd2cf', percent: 1050 },
			{ account: '0x5163C7ad7fe5637AC533280dF78cd801529c577d', percent: 4950 },
			{ account: '0xAA2f26eD45a3C55c9824F717C05460D198230943', percent: 200 },
			{ account: '0x178307eF9f8A88CEA9499078207e15F8d50428C6', percent: 100 },
			{ account: '0x45CC60482d650D58E54E7d0BE2D18D49586E8e6C', percent: 100 }
		];

		// Act
		const root = getRoot(collab);

		//Assert
		expect(root).toBe('0xe4c7fb3800eedd2bfae767dd66d53753043a9cc36cbb7ef3ab8b353e8e1f3bdc');
	});
});

describe('getProof', () => {
	it('getProof', () => {
		// Arrange
		const collab = [
			{ account: '0xD53ADeC981F32482cb8bbDb733791EA41DD64F74', percent: 1000 },
			{ account: '0x7642BE7ccd476c76a0b49c4c631bd9A403dF3E83', percent: 900 },
			{ account: '0x1ecc8e43660df8843B9172dF59367aAf18410E94', percent: 350 },
			{ account: '0xFED8706D9C6227E69e924526441043449559B249', percent: 250 },
			{ account: '0x18638D5563E763703B89c9A5171a060D420aF03E', percent: 100 },
			{ account: '0xD04634B1536C39d932FFB5Ef571f806C88a3A69C', percent: 1000 },
			{ account: '0xf33a205dCe3F05Bdd2a74875FB8E3b4A042Cd2cf', percent: 1050 },
			{ account: '0x5163C7ad7fe5637AC533280dF78cd801529c577d', percent: 4950 },
			{ account: '0xAA2f26eD45a3C55c9824F717C05460D198230943', percent: 200 },
			{ account: '0x178307eF9f8A88CEA9499078207e15F8d50428C6', percent: 100 },
			{ account: '0x45CC60482d650D58E54E7d0BE2D18D49586E8e6C', percent: 100 }
		];
		const index = 1;

		// Act
		const proof = getProof(collab, 1);

		//Assert
		expect(proof).toEqual([
			'0x4d4c8d9415b89b0b7ad6b1e9c1bd9042c4f477cf7e1c2e39d2a7c5ecfd430df9',
			'0xf358c032ddb09e4e9a99d1fc45f1d1ab2c00fecf476e1cb99cb4957939bd9db9',
			'0xf3b0c46cddf20b754dfaf0655cf0a6c4dea3de2cae66a8f30eebf87f7b3f50de',
			'0x45617ba582385cc439e4b0240a59c02936a72ddf449e1cd41e0f2eb62da200ae'
		]);
	});
});
