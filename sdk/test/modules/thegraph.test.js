import { getCollab, getAllocationsByAccount } from '../../src/modules/thegraph';

beforeAll(() => {
	process.env = {
		THEGRAPH_URL: 'https://api.thegraph.com/subgraphs/name/stendhal-labs/collab-splitter-rinkeby'
	};
});
describe('getAllocationsByAccount()', () => {
	it('existing account with 1 collab', async () => {
		// Arrange

		// Act
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						data: {
							account: {
								allocations: [
									{
										allocation: '5000',
										id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34-1',
										splitter: {
											allocations: [
												{
													allocation: '5000',
													recipient: {
														id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
													}
												},
												{
													allocation: '5000',
													recipient: {
														id: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
													}
												}
											],
											allocationsCount: '2',
											id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34',
											name: 'Test Stendhal',
											tokens: []
										}
									}
								],
								id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
							}
						}
					})
			})
		);
		const result = await getAllocationsByAccount(
			fetch,
			'0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
		);

		// Assert
		expect(result).toEqual([
			{
				allocation: '5000',
				id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34-1',
				splitter: {
					allocations: [
						{
							allocation: '5000',
							recipient: {
								id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
							}
						},
						{
							allocation: '5000',
							recipient: {
								id: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
							}
						}
					],
					allocationsCount: '2',
					id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34',
					name: 'Test Stendhal',
					tokens: []
				}
			}
		]);
	});

	it('non existing account', async () => {
		// Arrange

		// Act
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						data: { account: null }
					})
			})
		);
		const result = await getAllocationsByAccount(fetch, '0x123');

		// Assert
		expect(result).toEqual([]);
	});
});

describe('getCollab()', () => {
	it('existing collab', async () => {
		// Act
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						data: {
							collabSplitter: {
								allocations: [
									{
										allocation: '5000',
										id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34-1',
										recipient: {
											id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
										}
									},
									{
										allocation: '5000',
										id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34-2',
										recipient: {
											id: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
										}
									}
								],
								allocationsCount: '2',
								id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34',
								name: 'Test Stendhal',
								tokens: []
							}
						}
					})
			})
		);
		const result = await getCollab(fetch, '0xc506cd1a02b4c1223b005298b54f16aca31bbf34');

		// Assert
		expect(result).toEqual({
			allocations: [
				{
					allocation: '5000',
					id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34-1',
					recipient: {
						id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
					}
				},
				{
					allocation: '5000',
					id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34-2',
					recipient: {
						id: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
					}
				}
			],
			allocationsCount: '2',
			id: '0xc506cd1a02b4c1223b005298b54f16aca31bbf34',
			name: 'Test Stendhal',
			tokens: []
		});
	});
	it('non existing collab', async () => {
		// Arrange

		// Act
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						data: { account: null }
					})
			})
		);
		const result = await getCollab(fetch, '0x123');

		// Assert
		expect(result).toBeUndefined();
	});
});
