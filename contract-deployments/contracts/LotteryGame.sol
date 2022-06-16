//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

contract LotteryGame is VRFConsumerBase, KeeperCompatibleInterface {
    event Winners(address winner, bytes32 requestId, uint256 lotteryDay);
    event PlayersOnLotteryDay(address player, uint256 lotteryDay, uint entryAmount);
    address payable[] private players;
    address payable immutable owner;
    address constant _linkToken = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address constant _vrfCoordinator = 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
    bytes32 constant _keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    uint128 entryAmount;
    uint128 maxPrize;
    uint128 lotteryDay;
    uint128 constant _chainlinkFee = 0.0001 * 10 ** 18;
    uint public deadline;
    mapping(address => bool) private playerInTheGame;

    
   constructor(uint64 _entryAmount, uint64 _maxPrize) VRFConsumerBase(_vrfCoordinator, _linkToken) payable {
       entryAmount = _entryAmount;
       owner = payable(msg.sender);
       maxPrize = _maxPrize;
  }

    modifier onlyOwner {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    function enterTheGame() external payable {
        require(!playerInTheGame[msg.sender], "ALREADY_ENTERED");
        require(msg.value >= entryAmount, "INSUFFICIENT_FUNDS");
        playerInTheGame[msg.sender] = true;
        players.push(payable(msg.sender));
        if(players.length == 2) {
           deadline = block.timestamp + 12 hours;
        }
        emit PlayersOnLotteryDay(msg.sender, lotteryDay, entryAmount);
    }

    function changeMaxPrize(uint128 _maxPrize) external onlyOwner {
       maxPrize = _maxPrize;
    }

     function changeEntryAmount(uint128 _entryAmount) external onlyOwner {
       entryAmount = _entryAmount;
    }

     function removeLotteryFunds() external onlyOwner {
       require(address(this).balance > 0, "NO_FUNDS");
       payable(msg.sender).transfer(address(this).balance);
    }


    function checkUpkeep(bytes calldata /*checkData*/) external view override returns (bool upkeepNeeded, bytes memory /*performData*/) {
        bool hasLink = LINK.balanceOf(address(this)) >= _chainlinkFee;
        bool deadlinePassed = block.timestamp > deadline;
        bool enoughPlayers = players.length > 1;
        bool etherInContract = address(this).balance >= 1 ether;
        upkeepNeeded = hasLink && deadlinePassed && enoughPlayers && etherInContract;
    }

    function performUpkeep(bytes calldata /*performData*/) external override {
       require(LINK.balanceOf(address(this)) >= _chainlinkFee, "MORE_LINK");
       requestRandomness(_keyHash, _chainlinkFee);
       deadline = block.timestamp + 12 hours;
       lotteryDay++;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
     uint256 randomPrizeAmount = (randomness % maxPrize);
     address payable winner = players[randomness % players.length];
     (bool success, ) = winner.call{value: randomPrizeAmount}("");
     require(success, "FAILED_SEND");
     if(success == true) {
         emit Winners(winner, requestId, lotteryDay);
     }
   }

    function areYouIn() external view returns(bool) {
       return playerInTheGame[msg.sender];
    }

    function getEntryAmount() external view returns(uint) {
        return entryAmount;
    }

      function getMaxPrize() external view returns(uint) {
        return maxPrize;
    }

     function getLotteryDay() external view returns(uint) {
        return lotteryDay;
    }

    receive() external payable{}
    fallback() external payable{}
}