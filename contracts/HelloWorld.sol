pragma solidity ^0.5.0;

contract HelloWorld {
    string hello;

    constructor (string memory initialHello) public{
        hello=initialHello;
    }


    function setHello(string memory newHello) public {
        hello=newHello;
    }

    function getHello()public view returns(string memory) {
        return hello;
    }
}

