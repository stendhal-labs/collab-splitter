//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol';

/// @title CollabSplitterFactoryStorage
/// @author Simon Fremaux (@dievardump)
contract CollabSplitterFactoryStorage {
    // current Splitter implementation
    address internal _splitterImplementation;

    // gap
    uint256[50] private __gap;
}
