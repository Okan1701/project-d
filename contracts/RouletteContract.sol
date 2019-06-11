pragma solidity ^0.5.1;

contract RouletteContract {
    address payable[] public players;
    uint256 totalBetValue;
    uint256 homeTeamamount;
    uint256 awayTeamamount;
    struct Player {
        uint256 amountBet;
        uint256 teamSelected;
    }

    constructor(uint256 _teamSelected) public payable {
        playerBet[msg.sender].amountBet = msg.value;
        playerBet[msg.sender].teamSelected = _teamSelected;
        players.push(msg.sender);

        if (_teamSelected == 0)
        {
            homeTeamamount += msg.value;
        }
        else
        {
            awayTeamamount += msg.value;
        }
    }

    mapping(address => Player) public playerBet;


    function bet(uint256 _teamSelected) public payable {
        playerBet[msg.sender].amountBet = msg.value;
        playerBet[msg.sender].teamSelected = _teamSelected;
        players.push(msg.sender);

        if (_teamSelected == 0)
        {
            homeTeamamount += msg.value;
        }
        else
        {
            awayTeamamount += msg.value;
        }

    }

    function win(uint256 wonteam) public payable {


        address payable[1000] memory winners;
        uint256 count = 0;
        uint256 totalLoser;
        uint256 totalWinner;
        uint256 betlol;
        address add;
        address payable playerAddress;

        for (uint256 i = 0; i<players.length; i++)
        {
            playerAddress = players[i];

            if(wonteam == playerBet[msg.sender].teamSelected)
            {
            winners[count] = playerAddress;
            count++;
            }

        }
        if (wonteam == 0)
        {
            totalWinner = homeTeamamount;
            totalLoser = awayTeamamount;
        }
        else {
            totalWinner = awayTeamamount;
            totalLoser = homeTeamamount;
        }
        for (uint256 j = 0; j < count; j++)
        {
            if (winners[j] != address(0))
            {
                add = winners[j];
                betlol = playerBet[add].amountBet;
                winners[j].transfer((betlol*(10000+(totalLoser*10000/totalWinner)))/10000);
            }
        }
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
}
