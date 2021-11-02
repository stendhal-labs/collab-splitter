export const abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'operator',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'token',
				type: 'address'
			}
		],
		name: 'ERC20Claimed',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'operator',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'ETHClaimed',
		type: 'event'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		name: 'alreadyClaimed',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256'
			},
			{
				internalType: 'bytes32[]',
				name: 'merkleProof',
				type: 'bytes32[]'
			},
			{
				internalType: 'address[]',
				name: 'erc20s',
				type: 'address[]'
			}
		],
		name: 'claimBatch',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256'
			},
			{
				internalType: 'bytes32[]',
				name: 'merkleProof',
				type: 'bytes32[]'
			},
			{
				internalType: 'address[]',
				name: 'erc20s',
				type: 'address[]'
			}
		],
		name: 'claimERC20',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256'
			},
			{
				internalType: 'bytes32[]',
				name: 'merkleProof',
				type: 'bytes32[]'
			}
		],
		name: 'claimETH',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		name: 'erc20Data',
		outputs: [
			{
				internalType: 'uint256',
				name: 'totalReceived',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'lastBalance',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: 'accounts',
				type: 'address[]'
			},
			{
				internalType: 'uint256[]',
				name: 'percents',
				type: 'uint256[]'
			},
			{
				internalType: 'address',
				name: 'token',
				type: 'address'
			}
		],
		name: 'getBatchClaimableERC20',
		outputs: [
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address[]',
				name: 'accounts',
				type: 'address[]'
			},
			{
				internalType: 'uint256[]',
				name: 'percents',
				type: 'uint256[]'
			}
		],
		name: 'getBatchClaimableETH',
		outputs: [
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				internalType: 'address[]',
				name: 'tokens',
				type: 'address[]'
			}
		],
		name: 'getBatchClaimed',
		outputs: [
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'account',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'percent',
				type: 'uint256'
			}
		],
		name: 'getNode',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32'
			}
		],
		stateMutability: 'pure',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'merkleRoot_',
				type: 'bytes32'
			}
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'merkleRoot',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalReceived',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		stateMutability: 'payable',
		type: 'receive'
	}
];
