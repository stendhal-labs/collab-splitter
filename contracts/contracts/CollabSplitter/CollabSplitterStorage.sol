//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol';

/// @title CollabSplitterStorage
/// @author Simon Fremaux (@dievardump)
contract CollabSplitterStorage {
    // current Splitter implementation
    address internal _splitterImplementation;

    // gap
    uint256[50] private __gap;
}
