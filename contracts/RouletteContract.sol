pragma solidity ^0.5.1;

contract RouletteContract {
    address[] public players;
    uint256 public totalBetValue = 0;
    address[] public homeTeam;
    address[] public awayTeam;
    uint public teamSelected;

    constructor(uint team) public payable {
    }

    mapping(address => uint256) public playerBet;

    function addPlayer() public payable {
        players.push(msg.sender);
        playerBet[msg.sender] = msg.value;
        totalBetValue += msg.value;

        if (teamSelected == 0)
        {
            homeTeam.push(msg.sender);
        }
        if (teamSelected == 1)
        {
            awayTeam.push(msg.sender);
        }
        else
        {
            teamSelected = 10;
        }

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
