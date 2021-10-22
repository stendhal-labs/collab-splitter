//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/// @title CollabSplitterFactory
/// @author Simon Fremaux (@dievardump)
contract CollabSplitter is Initializable {
    event ETHClaimed(address operator, address account, uint256 amount);
    event ERC20Claimed(
        address operator,
        address account,
        uint256 amount,
        address token
    );

    struct ERC20Data {
        uint256 totalReceived;
        uint256 lastBalance;
    }

    // string public name;
    bytes32 public merkleRoot;

    // keeps track of how much was received in ETH since the start
    uint256 public totalReceived;

    // keeps track of how much an account already claimed ETH
    mapping(address => uint256) public alreadyClaimed;

    // keeps track of ERC20 data
    mapping(address => ERC20Data) public erc20Data;
    // keeps track of how much an account already claimed for a given ERC20
    mapping(address => mapping(address => uint256)) private erc20AlreadyClaimed;

    function initialize(bytes32 merkleRoot_) external initializer {
        merkleRoot = merkleRoot_;
    }

    receive() external payable {
        totalReceived += msg.value;
    }

    /// @notice Does claimETH and claimERC20 in one call
    /// @param account the account we want to claim for
    /// @param percent the allocation for this account | 2 decimal basis, meaning 1 = 100, 2.5 = 250 etc...
    /// @param merkleProof the merkle proof used to ensure this claim is legit
    /// @param erc20s the ERC20 contracts addresses to claim from
    function claimBatch(
        address account,
        uint256 percent,
        bytes32[] memory merkleProof,
        address[] memory erc20s
    ) public {
        require(
            MerkleProofUpgradeable.verify(
                merkleProof,
                merkleRoot,
                getNode(account, percent)
            ),
            'Invalid proof.'
        );

        _claimETH(account, percent);

        for (uint256 i; i < erc20s.length; i++) {
            _claimERC20(account, percent, erc20s[i]);
        }
    }

    /// @notice Allows to claim the ETH for an account
    /// @param account the account we want to claim for
    /// @param percent the allocation for this account | 2 decimal basis, meaning 1 = 100, 2.5 = 250 etc...
    /// @param merkleProof the merkle proof used to ensure this claim is legit
    function claimETH(
        address account,
        uint256 percent,
        bytes32[] memory merkleProof
    ) public {
        require(
            MerkleProofUpgradeable.verify(
                merkleProof,
                merkleRoot,
                getNode(account, percent)
            ),
            'Invalid proof.'
        );

        _claimETH(account, percent);
    }

    /// @notice Allows to claim an ERC20 for an account
    /// @dev To be able to do so, every time a claim is asked, we will compare both current and last known
    ///      balance for this contract, allowing to keep up to date on how much it has ever received
    ///      then we can calculate the full amount due to the account, and substract the amount already claimed
    /// @param account the account we want to claim for
    /// @param percent the allocation for this account | 2 decimal basis, meaning 1% = 100, 2.5% = 250 etc...
    /// @param merkleProof the merkle proof used to ensure this claim is legit
    /// @param erc20s the ERC20 contracts addresses to claim from
    function claimERC20(
        address account,
        uint256 percent,
        bytes32[] memory merkleProof,
        address[] memory erc20s
    ) public {
        require(
            MerkleProofUpgradeable.verify(
                merkleProof,
                merkleRoot,
                getNode(account, percent)
            ),
            'Invalid proof.'
        );

        for (uint256 i; i < erc20s.length; i++) {
            _claimERC20(account, percent, erc20s[i]);
        }
    }

    /// @notice Function to create the "node" in the merkle tree, given account and allocation
    /// @param account the account
    /// @param percent the allocation
    /// @return the bytes32 representing the node / leaf
    function getNode(address account, uint256 percent)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(account, percent));
    }

    /// @notice Helper allowing to know how much ETH is still claimable for a list of accounts
    /// @param accounts the account to check for
    /// @param percents the allocation for this account
    function getBatchClaimableETH(
        address[] memory accounts,
        uint256[] memory percents
    ) public view returns (uint256[] memory) {
        uint256[] memory claimable = new uint256[](accounts.length);
        for (uint256 i; i < accounts.length; i++) {
            claimable[i] = _calculateDue(
                totalReceived,
                percents[i],
                alreadyClaimed[accounts[i]]
            );
        }
        return claimable;
    }

    /// @notice Helper allowing to know how much of an ERC20 is still claimable for a list of accounts
    /// @param accounts the account to check for
    /// @param percents the allocation for this account
    /// @param token the token (ERC20 contract) to check on
    function getBatchClaimableERC20(
        address[] memory accounts,
        uint256[] memory percents,
        address token
    ) public view returns (uint256[] memory) {
        ERC20Data memory data = erc20Data[token];
        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 sinceLast = balance - data.lastBalance;

        // the difference between last claim and today's balance is what has been received as royalties
        // so we can add it to the total received
        data.totalReceived += sinceLast;

        uint256[] memory claimable = new uint256[](accounts.length);
        for (uint256 i; i < accounts.length; i++) {
            claimable[i] = _calculateDue(
                data.totalReceived,
                percents[i],
                erc20AlreadyClaimed[accounts[i]][token]
            );
        }

        return claimable;
    }

    /// @notice Helper to query how much an account already claimed for a list of tokens
    /// @param account the account to check for
    /// @param tokens the tokens addresses
    ///        use address(0) to query for nativ chain token
    function getBatchClaimed(address account, address[] memory tokens)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory claimed = new uint256[](tokens.length);
        for (uint256 i; i < tokens.length; i++) {
            if (tokens[i] == address(0)) {
                claimed[i] = alreadyClaimed[account];
            } else {
                claimed[i] = erc20AlreadyClaimed[account][tokens[i]];
            }
        }

        return claimed;
    }

    /// @dev internal function to claim ETH
    /// @param account the account we want to claim for
    /// @param percent the allocation for this account | 2 decimal basis, meaning 1% = 100, 2.5% = 250 etc...
    function _claimETH(address account, uint256 percent) internal {
        if (totalReceived == 0) return;

        uint256 dueNow = _calculateDue(
            totalReceived,
            percent,
            alreadyClaimed[account]
        );

        if (dueNow == 0) return;

        // update the already claimed first, blocking reEntrancy
        alreadyClaimed[account] += dueNow;

        // send the due;
        // @TODO: .call{}() calls with all gas left in the tx
        // Question: Should we limit the gas used here?!
        // It has to be at least enough for contracts (Gnosis etc...) to proxy and store
        (bool success, ) = account.call{value: dueNow}('');
        require(success, 'Error when sending ETH');

        emit ETHClaimed(msg.sender, account, dueNow);
    }

    /// @dev internal function to claim an ERC20
    /// @param account the account we want to claim for
    /// @param percent the allocation for this account | 2 decimal basis, meaning 1% = 100, 2.5% = 250 etc...
    /// @param erc20 the ERC20 contract to claim from
    function _claimERC20(
        address account,
        uint256 percent,
        address erc20
    ) internal {
        ERC20Data storage data = erc20Data[erc20];
        uint256 balance = IERC20(erc20).balanceOf(address(this));
        uint256 sinceLast = balance - data.lastBalance;

        // the difference between last known balance and today's balance is what has been received as royalties
        // so we can add it to the total received
        data.totalReceived += sinceLast;

        // now we can calculate how much is due to current account the same way we do for ETH
        if (data.totalReceived == 0) return;

        uint256 dueNow = _calculateDue(
            data.totalReceived,
            percent,
            erc20AlreadyClaimed[account][erc20]
        );

        if (dueNow == 0) return;

        // update the already claimed first
        erc20AlreadyClaimed[account][erc20] += dueNow;

        // transfer the dueNow
        require(
            IERC20(erc20).transfer(account, dueNow),
            'Error when sending ERC20'
        );

        // update the lastBalance, so we can recalculate next time
        // we could save this call by doing (balance - dueNow) but some ERC20 might have weird behavior
        // and actually make the balance different than this after the transfer
        // so for safety, reading the actual state again
        data.lastBalance = IERC20(erc20).balanceOf(address(this));

        // emitting an event will allow to identify claimable ERC20 in TheGraph
        // to be able to display them in the UI and keep stats
        emit ERC20Claimed(msg.sender, account, dueNow, erc20);
    }

    /// @dev Helpers that calculates how much is still left to claim
    /// @param total total received
    /// @param percent allocation
    /// @param claimed what was already claimed
    /// @return what is left to claim
    function _calculateDue(
        uint256 total,
        uint256 percent,
        uint256 claimed
    ) internal pure returns (uint256) {
        return (total * percent) / 10000 - claimed;
    }
}
