// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer, signer } = await getNamedAccounts();

    const CollabSplitter = await deployments.get('CollabSplitter');

    await deploy('CollabSplitterFactory', {
        from: deployer,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy',
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [
                        CollabSplitter.address,
                        ethers.constants.AddressZero,
                    ],
                },
            },
        },
        log: true,
    });
};
module.exports.tags = ['CollabSplitterFactory'];
