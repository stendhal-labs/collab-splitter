require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('hardhat-tracer');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomiclabs/hardhat-solhint');
const dotenv = require('dotenv');
const minimist = require('minimist');

function mergeConfigs(path) {
    const { parsed } = dotenv.config({
        path,
    });

    Object.keys(parsed).forEach((key) => {
        if ('' !== parsed[key]) {
            process.env[key] = parsed[key];
        }
    });
}

// load .env
dotenv.config();
// override .env with specific .env.[network]
var argv = minimist(process.argv.slice(2));

const networks = {};
if (argv.network && ['rinkeby', 'mainnet'].indexOf(argv.network) !== -1) {
    mergeConfigs(`.env.${argv.network}`);

    if (argv.network == 'rinkeby') {
        networks.rinkeby = {
            url: process.env.PROVIDER,
            accounts: [process.env.DEPLOYER_PKEY],
        };
    } else if (argv.network == 'mainnet') {
        networks.mainnet = {
            url: process.env.PROVIDER,
            gasPrice: 58000000000,
            accounts: [process.env.DEPLOYER_PKEY],
        };
    }
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        version: '0.8.9',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks,
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
        signer: {
            default: 1, // here this will by default take the second account as signer
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: process.env.ENABLE_GAS_REPORT ? true : false,
        gasPrice: 21,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
};
