// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/TranscriptRegistry.sol";

contract DeployTranscript is Script {
    function run() external {
        vm.startBroadcast();
        new TranscriptRegistry();
        vm.stopBroadcast();
    }
}