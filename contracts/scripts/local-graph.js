const { parseEther } = require('ethers/lib/utils');
const hre = require('hardhat');
// scripts/create-box.js
const { deployments, ethers } = require('hardhat');
const sdk = require('../../sdk/index');

async function main() {
    const { deployer } = await getNamedAccounts();

    const recipients = [
        '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9',
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

    await deployments.execute(
        'CollabSplitterFactory',
        { from: deployer, log: true },
        'createSplitter',
        'Stendhal',
        merkleRoot,
        recipients,
        amounts,
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
