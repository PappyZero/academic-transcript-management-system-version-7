// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/TranscriptRegistry.sol";

contract TranscriptTest is Test {
    TranscriptRegistry registry;
    
    function setUp() public {
        registry = new TranscriptRegistry();
    }

    function testSetHash() public {
        bytes32 testHash = keccak256(abi.encodePacked("test"));
        registry.setHash(testHash);
        assertEq(registry.getHash(address(this)), testHash);
    }
}