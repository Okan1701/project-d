pragma solidity ^0.5.1;

contract RouletteContract {
    address payable[] public players;
    address payable[] public homeTeamPlayers;
    address payable[] public awayTeamPlayers;
    uint256 totalBetValue;
    uint256 homeTeamamount;
    uint256 awayTeamamount;
    struct Player {
        uint256 amountBet;
        uint256 teamSelected;
        bool hasClaimedReward;
    }

    constructor(uint256 _teamSelected) public payable {
        playerBet[msg.sender].amountBet = msg.value;
        playerBet[msg.sender].teamSelected = _teamSelected;
        playerBet[msg.sender].hasClaimedReward = false;
        players.push(msg.sender);

        if (_teamSelected == 0)
        {
            homeTeamamount += msg.value;
            homeTeamPlayers.push(msg.sender);
        }
        else
        {
            awayTeamamount += msg.value;
            awayTeamPlayers.push(msg.sender);
        }

        totalBetValue += msg.value;
    }

    mapping(address => Player) public playerBet;


    function bet(uint256 _teamSelected) public payable {
        playerBet[msg.sender].amountBet = msg.value;
        playerBet[msg.sender].teamSelected = _teamSelected;
        playerBet[msg.sender].hasClaimedReward = false;
        players.push(msg.sender);

        if (_teamSelected == 0)
        {
            homeTeamamount += msg.value;
            homeTeamPlayers.push(msg.sender);
        }
        else
        {
            awayTeamamount += msg.value;
            awayTeamPlayers.push(msg.sender);
        }
        totalBetValue += msg.value;

    }

    function getReward(uint256 winningTeam) public payable {

        if (playerBet[msg.sender].teamSelected != winningTeam && winningTeam != 2) return;

        uint256 bonusEther;

        if (winningTeam == 0) {
            bonusEther = awayTeamamount / homeTeamPlayers.length;
        }
        if (winningTeam == 1) {
            bonusEther = homeTeamamount / awayTeamPlayers.length;
        }
        if (winningTeam == 2) {
            bonusEther = 0;
        }

        playerBet[msg.sender].hasClaimedReward = true;
        msg.sender.transfer(playerBet[msg.sender].amountBet + bonusEther);

    }

    function getPlayers() public view returns (address payable[] memory playersArray) {
        return players;
    }

    function getTotalBetValue() public view returns (uint256 betValue) {
        return homeTeamamount + awayTeamamount;
    }

    function getPlayerBet(address playerAddress) public view returns (uint256 betValue) {
        return playerBet[playerAddress].amountBet;
    }

    function getHomeTeamPlayers() public view returns (address payable[] memory homeTeamPlayersArray) {
        return homeTeamPlayers;
    }

    function getAwayTeamPlayers() public view returns (address payable[] memory awayTeamPlayersArray) {
        return awayTeamPlayers;
    }

    function checkIfPlayerAlreadyClaimedReward() public view returns (bool hasClaimed) {
        return playerBet[msg.sender].hasClaimedReward;
    }
}
