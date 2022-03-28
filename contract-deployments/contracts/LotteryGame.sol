//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract LotteryGame {
    //store the amount of players in a mapping or array, which ever saves more gas and is more efficient
    //set a time that will choose a winner every 24 hours/1 day
    //use VRF to select a random winner and use Chainlink Keepers that will help with resetting the time and maybe even deleting the players
    //Fund the Contract with a lot of ether and the contract will always pay out the winner
    //use an event that keeps track of the winners
    //The same number generated with VRF will be used to pick a random winner and to select a random amount of ether

    event Winners(address indexed winner);
    address[] players;
    mapping(address => bool) private playerInTheGame;
    uint public entryAmount;
    address immutable owner;

    constructor(uint _entryAmounnt) {
       entryAmount = _entryAmounnt;
       owner = msg.sender;
    }

    //maybe use ownable contract instead
    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function enterTheGame() public payable {
        require(msg.sender != address(0), "This address does not exist");
        require(!playerInTheGame[msg.sender], "You have already entered the lottery");
        require(msg.value >= entryAmount, "Put in at least 0.1 ether/matic to enter the lottery");
        playerInTheGame[msg.sender] = true;
        players.push(msg.sender);
        //make it where they are paying 0.01 ether for every day they are in the lotteryr
    }

    function exitTheGame() public {
      require(playerInTheGame[msg.sender], "You never entered the lottery");
      playerInTheGame[msg.sender] = false;
      address[] memory player = players;
      for(uint i = 0; i < players.length; i++) {
         if(player[i] == msg.sender) {
            delete player[i];
            break;
         }
      }
    }

    function areYouIn() public view returns(bool) {
       return playerInTheGame[msg.sender];
    }


    function removeLotteryFunds() public onlyOwner {
       require(address(this).balance > 0, "There are no funds in the coontract");
       (bool success, ) = owner.call{value: address(this).balance}("");
       require(success, "Failed to send ether");
    }


    //Use the graph to ouput who the last winner was

    receive() external payable{}
    fallback() external payable{}
}