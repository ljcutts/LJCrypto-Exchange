//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract SolidityIdeas {
    /*
      // function exitTheGame() public {
    //   require(playerInTheGame[msg.sender], "You never entered the lottery");
    //   playerInTheGame[msg.sender] = false;
    //   address payable[] memory player = players;
    //   for(uint i = 0; i < players.length; i++) {
    //      if(player[i] == msg.sender) {
    //         delete player[i];
    //         break;
    //      }
    //   }
    // }


     // function playersPayContract() public payable {
    //  address[] memory player = players;
    //   for(uint i = 0; i < players.length; i++) {
    //      if(player[i] != address(0)) {
    //        (bool success, ) =  address(this).balance.call{value: 0.01 ether}("");
    //        require(success, "Failed to send ether");
    //      }
    //   }
    //  }

     //store the amount of players in a mapping or array, which ever saves more gas and is more efficient
    //set a time that will choose a winner every 24 hours/1 day
    //use VRF to select a random winner and use Chainlink Keepers that will help with resetting the time and maybe even deleting the players
    //Fund the Contract with a lot of ether and the contract will always pay out the winner
    //use an event that keeps track of the winners
    //The same number generated with VRF will be used to pick a random winner and to select a random amount of ether

    */
}