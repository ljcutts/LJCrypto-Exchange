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
    address payable[] public players;
    address payable immutable owner;
    address private lastWinner;
    //This is for the Rinkeby Testnet. The addresses and bytes differ depending on the network
    address constant _linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    address constant _vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    bytes32 constant _keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint64 public entryAmount;
    uint64 public maxPrize;
    uint64 public lotteryDay;
    uint64 constant _chainlinkFee = 0.25 * 10 ** 18;
    uint lastUpKeep;
    uint public immutable deadline;
    mapping(address => bool) private playerInTheGame;

    
   constructor(uint64 _entryAmount, uint64 _maxPrize) VRFConsumerBase(_vrfCoordinator, _linkToken) payable {
       entryAmount = _entryAmount * 1 ether;
       owner = payable(msg.sender);
       deadline =  block.timestamp + 24 hours;
       maxPrize = _maxPrize * 1 ether;
       lastUpKeep = block.timestamp;
  }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    //The more the player pays for entryAmount the higher their chances
    //or when they deposit ether to the contract manually, they will increase their chances, maybe put more functoinality in the receive or fallback function for this

    function enterTheGame() public payable {
        // require(msg.sender != address(0), "This address does not exist");  //maybe check if the msg.sender is a contract address
        require(!playerInTheGame[msg.sender], "You have already entered the lottery");
        require(msg.value >= entryAmount, "Your amount has to be equal or greater than the entryAmount");
        playerInTheGame[msg.sender] = true;
        players.push(payable(msg.sender));
        emit PlayersOnLotteryDay(msg.sender, lotteryDay, entryAmount);
    }

    function changeMaxPrize(uint64 _maxPrize) public onlyOwner {
       maxPrize = _maxPrize * 1 ether;
    }

     function changeEntryAmount(uint64 _entryAmount) public onlyOwner {
       entryAmount = _entryAmount * 1 ether;
    }

     function removeLotteryFunds() external onlyOwner {
       require(address(this).balance > 0, "There are no funds in the contract");
       payable(msg.sender).transfer(address(this).balance);
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
     uint256 randomPrizeAmount = (randomness % maxPrize) * 1 ether;
     address payable winner = players[randomness % players.length];
     (bool success, ) = winner.call{value: randomPrizeAmount}("");
     require(success, "Failed to send lottery prize to winner");
     if(success == true) {
         lastWinner = winner;
         emit Winners(winner, requestId);
     }
   }

//maybe use the graph for more of these getter functions
   function balanceOfContract() public view returns(uint) {
       return address(this).balance;
   }

   function getMsgSender() public view returns(address) {
       return msg.sender;
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

   //use the graph to query all players
    function getAllPlayers() public view returns (address payable[] memory) {
        // address payable[] memory allPlayers = new address payable[](players.length);

        // for(uint i = 0; i < allPlayers.length; i++) {
        //   allPlayers[i] = players[i];
        // }  

        // return allPlayers;
        return players;
    }

    //Use the graph to ouput who the last winner was
    

    receive() external payable{}
    fallback() external payable{}
}