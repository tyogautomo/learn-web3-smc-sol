// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract SuperLottery {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == manager, "Winner can only determined by Manager.");
        _;
    }

    modifier noOwner() {
        require(msg.sender != manager, "Owner can't enter the ganme");
        _;
    }

    function enterGame() public payable noOwner {
        require(msg.value > 0.01 ether, "Minimum Ether is 0.011 Ether");

        players.push(payable(msg.sender));
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }

    function random() private view returns(uint) {
        // currently is hard to random a number in solidity, so i used the pseudo random logic (not literally random)
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))); // keccak256 same as sha3
    }

    function pickWinner() public onlyOwner {
        uint idx = random() % players.length;
        
        players[idx].transfer(address(this).balance);

        players = new address payable[](0);
    }
}