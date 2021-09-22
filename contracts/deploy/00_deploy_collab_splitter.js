// deploy/00_deploy_my_contract.js
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer, signer } = await getNamedAccounts();

    await deploy('CollabSplitter', {
        from: deployer,
        log: true,
    });
};
module.exports.tags = ['CollabSplitter'];
