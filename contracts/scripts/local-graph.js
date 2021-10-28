const { parseEther } = require('ethers/lib/utils');
const hre = require('hardhat');
// scripts/create-box.js
const { deployments, ethers } = require('hardhat');
const sdk = require('../../sdk/dist/collab-splitter.umd.js');

async function main() {
    const { deployer } = await getNamedAccounts();

    const recipients = [
        '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
        '0x28a8746e75304c0780E011BEd21C72cD78cd535E',
        '0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E',
    ];

    const amounts = [5000, 4000, 1000];

    const merkleRoot = sdk.getRoot(
        // creating the tree
        recipients.map((recipient, i) => ({
            account: recipient,
            percent: amounts[i],
        })),
    );

    const receipt = await deployments.execute(
        'CollabSplitterFactory',
        { from: deployer, log: true },
        'createSplitter',
        'Stendhal',
        merkleRoot,
        recipients,
        amounts,
    );

    const splitterAddress = receipt.events[0].args[0];

    // create an ERC20 Mock
    const ERC20Mock = await ethers.getContractFactory('ERC20Mock');
    erc20Mock = await ERC20Mock.deploy('name', 'ticker');
    await erc20Mock.deployed();

    // mint some of this ERC20 to the CollabSplitter just created
    await erc20Mock.mint(splitterAddress, '10000000000000000000');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
