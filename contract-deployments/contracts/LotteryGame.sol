//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

contract LotteryGame is VRFConsumerBase, KeeperCompatibleInterface {
    event Winners(address winner, bytes32 requestId);
    event PlayersOnLotteryDay(address player, uint256 lotteryDay, uint entryAmount);
    address payable[] players;
    address immutable owner;
    address private lastWinner;
    //This is for the Rinkeby Testnet. The addresses and bytes differ depending on the network
    address _linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    address _vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    bytes32 constant _keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint64 _chainlinkFee = 0.25 * 10 ** 18;
    uint public entryAmount;
    uint public deadline;
    uint public maxPrize;
    uint lotteryDay;
    uint lastUpKeep;
    mapping(address => bool) private playerInTheGame;
    
    
   constructor(uint _entryAmount, uint _maxPrize) VRFConsumerBase(_vrfCoordinator, _linkToken) {
       entryAmount = _entryAmount * 1 ether;
       owner = msg.sender;
       deadline =  block.timestamp + 24 hours;
       maxPrize = _maxPrize * 1 ether;
       lastUpKeep = block.timestamp;
  }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function enterTheGame() public payable {
        require(msg.sender != address(0), "This address does not exist");
        require(!playerInTheGame[msg.sender], "You have already entered the lottery");
        require(msg.value >= entryAmount, "Your amount has to be equal or greater than the entryAmount");
        playerInTheGame[msg.sender] = true;
        players.push(payable(msg.sender));
        emit PlayersOnLotteryDay(msg.sender, lotteryDay, entryAmount);
    }

    function changeMaxPrize(uint _maxPrize) public onlyOwner {
       maxPrize = _maxPrize * 1 ether;
    }

     function removeLotteryFunds() public onlyOwner {
       require(address(this).balance > 0, "There are no funds in the coontract");
       (bool success, ) = owner.call{value: address(this).balance}("");
       require(success, "Failed to send ether");
    }


    function checkUpkeep(bytes calldata /*checkData*/) external view override returns (bool upkeepNeeded, bytes memory /*performData*/) {
        bool hasLink = LINK.balanceOf(address(this)) >= _chainlinkFee;
        bool deadlinePassed = (block.timestamp - lastUpKeep) > deadline;
        bool enoughPlayers = players.length > 1;
        bool etherInContract = address(this).balance >= 5 ether;
        upkeepNeeded = hasLink && deadlinePassed && enoughPlayers && etherInContract;
    }

    function performUpkeep(bytes calldata /*performData*/) external override {
       require(LINK.balanceOf(address(this)) >= _chainlinkFee, "not enough LINK");
       requestRandomness(_keyHash, _chainlinkFee);
       lastUpKeep = block.timestamp;
       lotteryDay++;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
     uint256 randomWinner = randomness % players.length;
     uint256 randomPrizeAmount = (randomness % maxPrize) * 1 ether;
     address payable winner = players[randomWinner];
     (bool success, ) = winner.call{value: randomPrizeAmount}("");
     require(success, "Failed to send lottery prize to winner");
     if(success == true) {
         lastWinner = winner;
         emit Winners(winner, requestId);
     }
   }

    function areYouIn() public view returns(bool) {
       return playerInTheGame[msg.sender];
    }

    function playerCount() public view returns(uint) {
        return players.length;
    }

    function previousWinner() public view returns(address) {
        return lastWinner;
    }

    function getAllPlayers() public view returns (address payable[] memory) {
        address payable[] memory allPlayers = new address payable[](players.length);

        for(uint i = 0; i < allPlayers.length; i++) {
          allPlayers[i] = players[i];
        }  

        return allPlayers;
    }

    //Use the graph to ouput who the last winner was

    receive() external payable{}
    fallback() external payable{}
}