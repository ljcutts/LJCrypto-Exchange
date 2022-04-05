//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract SolidityIdeas {
  //LotteryGame
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






    //GuessingGame
    /* 
       function encodeStringValue() internal view returns(bytes memory) {
       return abi.encodePacked(currentStringValue);
   }

   
  function guessTheHash(bytes memory answer) public payable {
      require(msg.sender == players[0] || msg.sender == players[1], "You are not one of the players");
      require(!alreadyGuessed[msg.sender], "You already made a guess");
      if(keccak256(answer) == keccak256(abi.encodePacked("Hello"))) {
          payable(msg.sender).transfer(address(this).balance);
          delete players;
          currentGameId++;
          nonce = 0;
          emit Winners(msg.sender);
      } else {
         alreadyGuessed[msg.sender] = true;
         nonce++;
         revert("Your guess is wrong");
      }
      if(nonce == 2) {
          delete players;
      }
   }
 

 function statement() internal view returns(bool) {
     return (currentNumberValue > 1 ether);
 }
 keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))
    
    */
}