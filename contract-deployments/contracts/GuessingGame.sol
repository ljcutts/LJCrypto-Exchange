//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract GuessingGame is VRFConsumerBase {
   event CurrentGame(address Player, uint GameId);
   event Winners(address Winner, bytes32 requestId, uint GameId);
   event Ended(address Player, uint GameId);
   address payable[] players;
   address immutable owner;
   address constant _linkToken = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
   address constant _vrfCoordinator = 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
   bytes32 constant _keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
   bytes32 currentRequestId;
   uint currentNumberValue = 0;
   uint public currentGameId = 1;
   uint timeLimit;
   uint128 public nonce;
   uint128 constant _chainlinkFee = 0.0001 * 10 ** 18;
   mapping(address => bool) public alreadyGuessed;
   mapping(address => bool) public alreadyEntered;

   constructor() VRFConsumerBase(_vrfCoordinator, _linkToken) payable {
      owner = msg.sender;
   }
   
   function enterGuessingGame() external payable {
     require(players.length < 2, "WAIT_NEXT_NAME");
     require(msg.value >= 0.1 ether, "INSUFFICIENT_FUNDS");
     require(alreadyEntered[msg.sender] == false, "ALREADY_ENTERED");
     players.push(payable(msg.sender));
     alreadyGuessed[msg.sender] = false;
     if(players.length == 2) {
      generateRandomNumberValue();
      timeLimit = 20 minutes;
     }
     alreadyEntered[msg.sender] = true;
     emit CurrentGame(msg.sender, currentGameId);
   }

   function generateRandomNumberValue() private returns(bytes32 requestId) {
      require(LINK.balanceOf(address(this)) >= _chainlinkFee, "MORE_LINK");
      return requestRandomness(_keyHash, _chainlinkFee);
   }
   
   
   function guessTheNumberValue(bool guess) external payable {
      require(msg.sender == players[0] || msg.sender == players[1], "NOT_A_PLAYERR");
      require(!alreadyGuessed[msg.sender], "ALREADY_GUESSED");
      require(currentNumberValue > 0, "WAIT_FOR_NUMBER");
      if((currentNumberValue > 50) == guess) {
          payable(msg.sender).transfer(address(this).balance);
          alreadyEntered[players[0]] = false;
          alreadyEntered[players[1]] = false;
          delete players;
          emit Winners(msg.sender, currentRequestId, currentGameId);
          currentGameId++;
          nonce = 0;
          currentNumberValue = 0;
      } else {
         alreadyGuessed[msg.sender] = true;
         alreadyEntered[msg.sender] = false;
         nonce++;
      }
      if(nonce == 2) {
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

   function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
      currentNumberValue = (randomness % 100);
      currentRequestId = requestId;
   }

    function withdraw() external  {
            require(msg.sender == owner, "NOT_OWNER");
            uint256 amount = address(this).balance;
            (bool sent, ) =  payable(msg.sender).call{value: amount}("");
            require(sent, "SEND_FAILED");
   }

   function didYouGuess() external view returns(bool) {
      return alreadyGuessed[msg.sender];
   }

   function numberAboveZero() external view returns(bool) {
      return currentNumberValue > 0;
   }

   receive() external payable{}
   fallback() external payable{}
}