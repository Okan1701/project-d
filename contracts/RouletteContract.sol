pragma solidity ^0.5.7;

contract RouletteContract {
    address[] public players;
    address public owner;
    uint256 public totalBetValue = 0;

    mapping(address => uint256) public playerBet;

    constructor() public payable {
        owner = msg.sender;
        players.push(msg.sender);
        playerBet[msg.sender] = msg.value;
        totalBetValue += msg.value;
    }

    function addPlayer() public payable {
        players.push(msg.sender);
        playerBet[msg.sender] = msg.value;
        totalBetValue += msg.value;
    }

    function win() public {
        msg.sender.transfer(totalBetValue);
    }

    function getPlayers() public view returns (address[] memory playersArray) {
        return players;
    }

    function getTotalBetValue() public view returns (uint256 betValue) {
        return totalBetValue;
    }

    function getPlayerBet(address playerAddress) public view returns (uint256 betValue) {
        return playerBet[playerAddress];
    }
}