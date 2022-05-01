//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract GuessingGame is VRFConsumerBase {
   event CurrentGame(address Player, uint GameId);
   event Winners(address Winner, bytes32 requestId, uint GameId);
   event Ended(address Player, uint GameId);
   address payable[] players;
   address immutable owner;
   address constant _linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
   address constant _vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
   bytes32 constant _keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
   bytes32 currentRequestId;
   uint currentNumberValue = 0;
   uint public currentGameId = 1;
   uint timeLimit;
   uint128 public nonce;
   uint128 constant _chainlinkFee = 0.1 * 10 ** 18;
   mapping(address => bool) public alreadyGuessed;
   mapping(address => bool) public alreadyEntered;

   constructor() VRFConsumerBase(_vrfCoordinator, _linkToken) payable {
      owner = msg.sender;
   }
   
   function enterGuessingGame() public payable {
     require(players.length < 2, "You will have to wait to enter the next game");
     require(msg.value >= 0.1 ether, "You need to at least put in 0.1 ether to join the game");
     require(alreadyEntered[msg.sender] == false, "You can't enter twice");
     players.push(payable(msg.sender));
     alreadyGuessed[msg.sender] = false;
     if(players.length == 2) {
      generateRandomNumberValue();
      timeLimit = 10 minutes;
     }
     alreadyEntered[msg.sender] = true;
     emit CurrentGame(msg.sender, currentGameId);
   }

   function generateRandomNumberValue() private returns(bytes32 requestId) {
      require(LINK.balanceOf(address(this)) >= _chainlinkFee, "Not enough LINK");
      return requestRandomness(_keyHash, _chainlinkFee);
   }
   
   
   function guessTheNumberValue(bool guess) public payable {
      require(msg.sender == players[0] || msg.sender == players[1], "You are not one of the players");
      require(!alreadyGuessed[msg.sender], "You already made a guess");
      require(currentNumberValue > 0, "The number hasn't changed value yet");
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

   function timeIsUp() public {
      require(block.timestamp > timeLimit && currentNumberValue > 0, "Hasn't Been 10 Minutes After Number Was Generated");
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

    function withdraw() public  {
            require(msg.sender == owner, "You are not the owner");
            uint256 amount = address(this).balance;
            (bool sent, ) =  payable(msg.sender).call{value: amount}("");
            require(sent, "Failed to send Ether");
   }

   function didYouGuess() public view returns(bool) {
      return alreadyGuessed[msg.sender];
   }

   function numberAboveZero() public view returns(bool) {
      return currentNumberValue > 0;
   }

   receive() external payable{}
   fallback() external payable{}
}