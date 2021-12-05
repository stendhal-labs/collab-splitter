export default {
	'1': {
		name: 'Ethereum',
		private: false,
		factory_address: '0x486E4CCd2970C1971f41AA16EEFf078f821F3E9a',
		graph_url: 'https://api.thegraph.com/subgraphs/name/stendhal-labs/collab-splitter-mainnet',
		explorer_url: 'https://etherscan.io',
	},
	'4': {
		name: 'Rinkeby',
		private: true, // this network only shows up if it's selected; because test network
		factory_address:'0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
		graph_url: 'https://api.thegraph.com/subgraphs/name/stendhal-labs/collab-splitter-rinkeby',
		explorer_url: 'https://rinkeby.etherscan.io',
	}
};