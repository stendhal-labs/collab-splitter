//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import './CollabSplitterFactory/CollabSplitterFactoryStorage.sol';
import './CollabSplitter.sol';

/// @title CollabSplitterFactory
/// @author Simon Fremaux (@dievardump)
/// @notice This contract allows people to create a "Splitter" -> a contract that will
///         allow to split the ETH or ERC20 it received, between several addresses
///         This contract is upgradeable, because we might have to add functionalities
///         or versioning over time.
///         However, the Factory has no authority over a Splitter after it's created
///         which ensure that updates to the current contract
///         won't create any problems / exploits on existing Splitter
contract CollabSplitterFactory is
    OwnableUpgradeable,
    CollabSplitterFactoryStorage
{
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    // emitted when a splitter contract is created
    event SplitterCreated(
        address indexed splitter,
        string name,
        address[] recipients,
        uint256[] amounts
    );

    constructor() {}

    function initialize(address splitterImplementation, address owner_)
        external
        initializer
    {
        _setSplitterImplementation(splitterImplementation);

        if (owner_ != address(0)) {
            transferOwnership(owner_);
        }
    }

    /// @notice Getter for the Splitter Implementation
    function getSplitterImplementation() public view returns (address) {
        return _splitterImplementation;
    }

    /// @notice Creates a new CollabSplitter contract
    /// @dev the contract created is a minimal proxy to the _splitterImplementation
    ///      the list of recipients (and the corresponding amounts) should then be used in the exact same order
    ///      to create the merkleProof and merkleRoot
    /// @param name_ name of the Splitter (for convenience)
    /// @param merkleRoot merkle root of the tree of recipients
    /// @param recipients list of recipients
    /// @param amounts list of amounts
    /// @return newContract the address of the new contract
    function createSplitter(
        string memory name_,
        bytes32 merkleRoot,
        address[] memory recipients,
        uint256[] memory amounts
    ) external payable returns (address newContract) {
        require(_splitterImplementation != address(0), '!NO_IMPLEMENTATION!');

        require(recipients.length == amounts.length, '!LENGTH_MISMATCH!');

        // create minimal proxy to _splitterImplementation
        newContract = ClonesUpgradeable.clone(_splitterImplementation);

        // initialize the non upgradeable proxy
        CollabSplitter(payable(newContract)).initialize(merkleRoot);

        // emit an event with all the data needed to reconstruct later the merkle tree
        // and allow people to claim their eth / tokens
        // using events will allow to store everything in TheGraph (or similar) in a decentralized way
        // while still be less expensive than storing in the CollabSplitter storage
        emit SplitterCreated(newContract, name_, recipients, amounts);
    }

    /// @notice Setter for the Splitter Implementation
    /// @param implementation the address to proxy calls to
    function setSplitterImplementation(address implementation)
        public
        onlyOwner
    {
        _setSplitterImplementation(implementation);
    }

    /// @dev internal setter for the Splitter Implementation
    /// @param implementation the address to proxy calls to
    function _setSplitterImplementation(address implementation) internal {
        _splitterImplementation = implementation;
    }
}
