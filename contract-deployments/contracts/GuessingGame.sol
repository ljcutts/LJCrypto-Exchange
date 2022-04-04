//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract GuessingGame {
   //There will be two players and there will be a random generated uint
   //The two players will have to figure out the encoded version of that string value and whoever guesses the right answer first will get rewarded with 0.5-1 ether
   //Probably use Chainlink VRF for this one
   event CurrentGame(address Player, uint GameId);
   event Winners(address winner);
   address payable[] public players;
   uint public currentNumberValue;
   uint currentGameId;
   uint nonce;
   address payable immutable owner;
   mapping(address => bool) alreadyGuessed;

   constructor() {
     owner = payable(msg.sender);
   }

     modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

   function enterGuessingGame() public payable {
     require(players.length < 2, "You will have to wait to enter the next game");
     require(msg.value >= 0.1 ether, "You need to at least put in 0.1 ether to join the game");
     players.push(payable(msg.sender));
     alreadyGuessed[msg.sender] = false;
     if(players.length == 2) {
         //requestRandomness
     }
     emit CurrentGame(msg.sender, currentGameId);
   }

   function generateRandomNumberValue(uint number) public onlyOwner {
      currentNumberValue = number * 1 ether;
   }
   

   function guessTheNumberValue(bool guess) public payable {
      require(msg.sender == players[0] || msg.sender == players[1], "You are not one of the players");
      require(!alreadyGuessed[msg.sender], "You already made a guess");
      if((currentNumberValue > 1 ether) == guess) {
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

   receive() external payable{}
   fallback() external payable{}
}