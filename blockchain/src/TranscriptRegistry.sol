// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TranscriptRegistry {
    mapping(address => bytes32) public transcriptHashes;
    event HashUpdated(address indexed user, bytes32 hash);

    function setHash(bytes32 _hash) public {
        transcriptHashes[msg.sender] = _hash;
        emit HashUpdated(msg.sender, _hash);
    }

    function getHash(address _user) public view returns (bytes32) {
        return transcriptHashes[_user];
    }
}