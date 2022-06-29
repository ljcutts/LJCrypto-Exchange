//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
/**
 * @dev This is a guessing game that is meant for the mumbai testnet. Players have to guess if the number will be greater than 50. Will win the contract balance if they guess right. The user will enter the game and will have to pay 0.1 Matic or more to become a player. Only two players can enter at a time. Once there are two players in the players array, a random number will be generated. Also a timeLimit will be set to 20 minutes. This is so that once a number is already generated that if both players haven't made a guess, they can get deleted so that it doesn't freeze the contract.
 */

contract GuessingGame is VRFConsumerBase {
   //Event used to keep track of players for that current gameId
   event CurrentGame(address Player, uint GameId);
   //Event used to keep track of the winner for that gameId along with the requestId from the VRF
   event Winners(address Winner, bytes32 requestId, uint GameId);
   //Event used for when players are deleted for not guessing in time for that current gameId
   event Ended(address Player, uint GameId);
   //Addrress array to keep track of the two players in the game
   address payable[] players;
   //Owner of the contract
   address immutable owner;
   address constant _linkToken = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
   address constant _vrfCoordinator = 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
   bytes32 constant _keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
   bytes32 currentRequestId;
   uint currentNumberValue;
   //Current GuessingGame gameId
   uint public currentGameId = 1;
   //Time until players can get deleted for not guessing in time
   uint timeLimit;
   //Number to keep track of how many guesses have been made from the players. Game resets If both guesses were not true and nonce is 2
   uint128 public nonce;
   uint128 constant _chainlinkFee = 0.0001 * 10 ** 18;
   //Mappings that keep track of the players who have already entered and guessed for current game
   mapping(address => bool) public alreadyGuessed;
   mapping(address => bool) public alreadyEntered;

 /**
     * @dev 
     Sets the deployer of the contract as the owner and passes in the VRFCoordinator address and Linktoken address as arguments for the VRFConsumerBase
     */
   constructor() VRFConsumerBase(_vrfCoordinator, _linkToken) payable {
      owner = msg.sender;
   }
   
    /**
     * @dev 
    Pushes users into the address array to keep track of whos in the game. Only two can enter at a time, users have to pay to execute function, and users cannot enter twice for the same game.
     */
   function enterGuessingGame() external payable {
     require(players.length < 2, "WAIT_NEXT_NAME");
     require(msg.value >= 0.1 ether, "INSUFFICIENT_FUNDS");
     require(alreadyEntered[msg.sender] == false, "ALREADY_ENTERED");
     players.push(payable(msg.sender));
     alreadyGuessed[msg.sender] = false;
     if(players.length == 2) {
      //A random number will be generated once two players have entered and the countdown for both players will start after the number has been generated
      generateRandomNumberValue();
      timeLimit = 20 minutes;
     }
     alreadyEntered[msg.sender] = true;
     emit CurrentGame(msg.sender, currentGameId);
   }

   /**
     * @dev 
    Makes sure contract has enough link and calls the VRFCoordinator to receive a random number
     */
   function generateRandomNumberValue() private returns(bytes32 requestId) {
      require(LINK.balanceOf(address(this)) >= _chainlinkFee, "MORE_LINK");
      return requestRandomness(_keyHash, _chainlinkFee);
   }
   
    /**
     * @dev 
      Allows user to guess if the random number is above 50 or not 
      * @param guess - can enter true or false if number is above 50 or not
     */
   function guessTheNumberValue(bool guess) external payable {
      require(msg.sender == players[0] || msg.sender == players[1], "NOT_A_PLAYERR");
      require(!alreadyGuessed[msg.sender], "ALREADY_GUESSED");
      require(currentNumberValue > 0, "WAIT_FOR_NUMBER");
      if((currentNumberValue > 50) == guess) {
          //If the guess is true, the player will win the matic that is in the contract and the game resets including the mappings, nonce, random number, and player array
          payable(msg.sender).transfer(address(this).balance);
          alreadyEntered[players[0]] = false;
          alreadyEntered[players[1]] = false;
          delete players;
          emit Winners(msg.sender, currentRequestId, currentGameId);
          currentGameId++;
          nonce = 0;
          currentNumberValue = 0;
      } else {
         //If the guess is wrong the nonce is incremented and the alreadGuessed mapping is set to true so that the player won't be able to guess more than once. AlreadyEntered is set to false so that the player is allowed to enter the next game
         alreadyGuessed[msg.sender] = true;
         alreadyEntered[msg.sender] = false;
         nonce++;
      }
      if(nonce == 2) {
         //This is when both players guess wrong and the game resets
          alreadyEntered[players[0]] = false;
          alreadyEntered[players[1]] = false;
          emit Ended(players[0], currentGameId);
          emit Ended(players[1], currentGameId);
          delete players;
          currentNumberValue = 0;
          nonce = 0;
          currentGameId++;
      }
   }
 /**
     * @dev 
      * If 20 minutes have already passed since both players joined and the random number is above 0, anyone can call this function to start a new game and delete current players
     */
   function timeIsUp() external {
      require(block.timestamp > timeLimit && currentNumberValue > 0, "CANT_END_YET");
          alreadyEntered[players[0]] = false;
          alreadyEntered[players[1]] = false;
          emit Ended(players[0], currentGameId);
          emit Ended(players[1], currentGameId);
          delete players;
          currentNumberValue = 0;
          nonce = 0;
          timeLimit = 0;
   }

 /**
     * @dev 
    Fullfills the request for random number
     */
   function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
      currentNumberValue = (randomness % 100);
      currentRequestId = requestId;
   }

  /**
     * @dev 
      * Allows the owner of the contract to withdraw all funds from the contract
     */
    function withdraw() external  {
            require(msg.sender == owner, "NOT_OWNER");
            uint256 amount = address(this).balance;
            (bool sent, ) =  payable(msg.sender).call{value: amount}("");
            require(sent, "SEND_FAILED");
   }

 /**
     * @dev 
      * User can check if they are a current player in the game
     */
   function didYouGuess() external view returns(bool) {
      return alreadyGuessed[msg.sender];
   }

 /**
     * @dev 
      * Checks if the random number has been generated and is greater than zero
     */
   function numberAboveZero() external view returns(bool) {
      return currentNumberValue > 0;
   }

   receive() external payable{}
   fallback() external payable{}
}