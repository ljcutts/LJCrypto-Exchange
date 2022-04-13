//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract GuessingGame is VRFConsumerBase {
   //There will be two players and there will be a random generated uint
   //The two players will have to figure out the encoded version of that string value and whoever guesses the right answer first will get rewarded with 0.5-1 ether
   //Probably use Chainlink VRF for this one
   //Continue to think about how you will use subgraphs
   event CurrentGame(address Player, uint GameId);
   event Winners(address winner, bytes32 requestId);
   address payable[] public players;
   address public previousWinner;
   address constant _linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
   address constant _vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
   bytes32 constant _keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
   bytes32 currentRequestId;
   uint public currentNumberValue;
   uint public currentGameId;
   uint128 public nonce;
   uint128 constant _chainlinkFee = 0.1 * 10 ** 18;
   mapping(address => bool) public alreadyGuessed;

   constructor() VRFConsumerBase(_vrfCoordinator, _linkToken) payable {
   }

   function enterGuessingGame() public payable {
     require(players.length < 2, "You will have to wait to enter the next game");
     require(msg.value >= 0.1 ether, "You need to at least put in 0.1 ether to join the game");
     players.push(payable(msg.sender));
     alreadyGuessed[msg.sender] = false;
     if(players.length == 2) {
      generateRandomNumberValue();
     }
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
      if((currentNumberValue > 10 ether) == guess) {
          payable(msg.sender).transfer(address(this).balance);
          delete players;
          currentGameId++;
          nonce = 0;
          currentNumberValue = 0;
          previousWinner = msg.sender;
          emit Winners(msg.sender, currentRequestId);
      } else {
         alreadyGuessed[msg.sender] = true;
         nonce++;
      }
      if(nonce == 2) {
          delete players;
          currentNumberValue = 0;
          nonce = 0;
      }
   }

   function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
      currentNumberValue = (randomness % 100) * 1 ether;
      currentRequestId = requestId;
   }


   function getMsgSender() public view returns(address) {
       return msg.sender;
   }

   function receiveBalance() public view returns(uint) {
      return address(msg.sender).balance;
   }

   function playerLength() public view returns(uint) {
      return players.length;
   }

   function didYouGuess() public view returns(bool) {
      return alreadyGuessed[msg.sender];
   }

   receive() external payable{}
   fallback() external payable{}
}