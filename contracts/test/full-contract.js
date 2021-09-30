const { expect } = require('chai');
const { deployments, ethers } = require('hardhat');
const sdk = require('../../sdk');

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
    { account: '0x45CC60482d650D58E54E7d0BE2D18D49586E8e6C', percent: 100 },
];

describe('CollabSplitter', () => {
    let deployer;
    let factory;
    let splitterImplementation;
    let erc20Mock;
    beforeEach(async () => {
        [deployer] = await ethers.getSigners();

        await deployments.fixture();
        CollabSplitterFactory = await deployments.get('CollabSplitterFactory');
        factory = await ethers.getContractAt(
            'CollabSplitterFactory',
            CollabSplitterFactory.address,
            deployer,
        );

        CollabSplitter = await deployments.get('CollabSplitter');
        splitterImplementation = await ethers.getContractAt(
            'CollabSplitter',
            CollabSplitter.address,
            deployer,
        );

        const ERC20Mock = await ethers.getContractFactory('ERC20Mock');
        erc20Mock = await ERC20Mock.deploy('name', 'ticker');
        await erc20Mock.deployed();
    });

    async function claimETH(contract, accountIndex) {
        // try to withdraw for account
        const splitter = await ethers.getContractAt(
            'CollabSplitter',
            contract,
            deployer,
        );

        const collabAccount = collab[accountIndex];

        const acc = await splitter.totalReceived();
        let due = acc.mul(collabAccount.percent).div(10000);

        // console.log(due.toString());

        await splitter.claimETH(
            collabAccount.account,
            collabAccount.percent,
            sdk.getProof(collab, accountIndex),
        );

        expect(
            await deployer.provider.getBalance(collabAccount.account),
        ).to.be.equal(due);

        return due;
    }

    async function claimERC20(contract, accountIndex, erc20Contract) {
        // try to withdraw for account
        const splitter = await ethers.getContractAt(
            'CollabSplitter',
            contract,
            deployer,
        );

        const collabAccount = collab[accountIndex];

        const balance = await erc20Mock.balanceOf(collabAccount.account);

        const [due] = await splitter.getBatchClaimableERC20(
            [collabAccount.account],
            [collabAccount.percent],
            erc20Contract.address,
        );

        await splitter.claimERC20(
            collabAccount.account,
            collabAccount.percent,
            sdk.getProof(collab, accountIndex),
            erc20Contract.address,
        );

        expect(await erc20Mock.balanceOf(collabAccount.account)).to.be.equal(
            balance.add(due),
        );

        // return what has been claimed since the start
        return balance.add(due);
    }

    describe('Merkle Tree', async function () {
        it('solidity getNode(account, percent) result matches the javascript one', async function () {
            for (let i = 0; i < collab.length; i++) {
                const node = collab[i];
                expect(
                    await splitterImplementation.getNode(
                        node.account,
                        node.percent,
                    ),
                ).to.equal(sdk.getNode(node.account, node.percent));
            }
        });
    });

    describe('CollabSplitterFactory', async function () {
        it('can create a contract', async function () {
            await factory.createSplitter(
                'Test',
                sdk.getRoot(collab),
                collab.map((a) => a.account),
                collab.map((a) => a.percent),
            );
        });

        it('can create a contract and withdraw', async function () {
            const tx = await factory.createSplitter(
                'Test',
                sdk.getRoot(collab),
                collab.map((a) => a.account),
                collab.map((a) => a.percent),
            );

            const receipt = await tx.wait();

            // get splitter address from events
            const address = receipt.events[0].args[0];

            // try to withdraw for account
            const splitter = await ethers.getContractAt(
                'CollabSplitter',
                address,
                deployer,
            );

            const ZERO = ethers.utils.parseEther('0');
            const ONE = ethers.utils.parseEther('1.0');

            // send 1eth to contract
            await deployer.sendTransaction({
                to: address,
                value: ONE,
            });

            expect(await deployer.provider.getBalance(address)).to.be.equal(
                ONE,
            );

            // verify account is empty
            expect(
                await deployer.provider.getBalance(collab[1].account),
            ).to.be.equal(ZERO);

            await claimETH(address, 1);

            // again send eth to the contract
            // and ensure the claim only gives the rest due and not again 9% of everything
            // send 1eth to contract
            await deployer.sendTransaction({
                to: address,
                value: ONE,
            });

            const due = await claimETH(address, 1);

            // verify that the cotract balance is only totalReceived - due
            expect(await deployer.provider.getBalance(address)).to.be.equal(
                (await splitter.totalReceived()).sub(due),
            );

            // now try to claim with another account
            // verify account is empty
            expect(
                await deployer.provider.getBalance(collab[5].account),
            ).to.be.equal(ZERO);
            const due2 = await claimETH(address, 5);

            // verify that the cotract balance is only totalReceived - due
            expect(await deployer.provider.getBalance(address)).to.be.equal(
                (await splitter.totalReceived()).sub(due.add(due2)),
            );
        });

        it('can not withdraw with fake data', async function () {
            const tx = await factory.createSplitter(
                'Test',
                sdk.getRoot(collab),
                collab.map((a) => a.account),
                collab.map((a) => a.percent),
            );

            const receipt = await tx.wait();

            const address = receipt.events[0].args[0];

            // send 1eth to contract
            await deployer.sendTransaction({
                to: address,
                value: ethers.utils.parseEther('1.0'),
            });

            expect(await deployer.provider.getBalance(address)).to.be.equal(
                ethers.utils.parseEther('1.0'),
            );

            // verify account is empty
            const collabAccount = collab[1];
            expect(
                await deployer.provider.getBalance(collabAccount.account),
            ).to.be.equal(ethers.utils.parseEther('0'));

            // try to withdraw for account
            const splitter = await ethers.getContractAt(
                'CollabSplitter',
                address,
                deployer,
            );

            await expect(
                splitter.claimETH(
                    collabAccount.account,
                    collabAccount.percent + 1, // try to change percentage
                    sdk.getProof(collab, 1),
                ),
            ).to.be.revertedWith('Invalid proof.');
        });

        it('can works all the same with ERC20', async function () {
            const tx = await factory.createSplitter(
                'Test',
                sdk.getRoot(collab),
                collab.map((a) => a.account),
                collab.map((a) => a.percent),
            );

            const receipt = await tx.wait();

            // get splitter address from events
            const address = receipt.events[0].args[0];

            // try to withdraw for account
            const splitter = await ethers.getContractAt(
                'CollabSplitter',
                address,
                deployer,
            );

            const ZERO = ethers.utils.parseEther('0');
            const ONE = ethers.utils.parseEther('1.0');

            // send ONE to contract
            await erc20Mock.mint(address, ONE);

            expect(await erc20Mock.balanceOf(address)).to.be.equal(ONE);

            // verify account is empty
            expect(await erc20Mock.balanceOf(collab[1].account)).to.be.equal(
                ZERO,
            );

            await claimERC20(address, 1, erc20Mock);

            // again send eth to the contract
            // and ensure the claim only gives the rest due and not again 9% of everything
            // send ONE to contract
            await erc20Mock.mint(address, ONE);

            const due = await claimERC20(address, 1, erc20Mock);

            // verify that the contract balance is only totalReceived - due

            // first get erc20Data
            const erc20Data = await splitter.erc20Data(erc20Mock.address);

            // then check that our contract's balance is now totalReceived - what was claimed
            expect(await erc20Mock.balanceOf(address)).to.be.equal(
                erc20Data.totalReceived.sub(due),
            );

            // now try to claim with another account
            // verify account is empty
            expect(await erc20Mock.balanceOf(collab[5].account)).to.be.equal(
                ZERO,
            );

            const due2 = await claimERC20(address, 5, erc20Mock);

            // then check that our contract's balance is now totalReceived - (due + due2)
            expect(await erc20Mock.balanceOf(address)).to.be.equal(
                erc20Data.totalReceived.sub(due.add(due2)),
            );
        });
    });
});
