//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

contract LotteryGame is VRFConsumerBase, KeeperCompatibleInterface {
    //store the amount of players in a mapping or array, which ever saves more gas and is more efficient
    //set a time that will choose a winner every 24 hours/1 day
    //use VRF to select a random winner and use Chainlink Keepers that will help with resetting the time and maybe even deleting the players
    //Fund the Contract with a lot of ether and the contract will always pay out the winner
    //use an event that keeps track of the winners
    //The same number generated with VRF will be used to pick a random winner and to select a random amount of ether

    event Winners(address indexed winner);
    address payable[] players;
    mapping(address => bool) private playerInTheGame;
    uint public entryAmount;
    uint public immutable deadline;
    address immutable owner;
    address _linkToken = 0xa36085F69e2889c224210F603D836748e7dC0088;
    address _vrfCoordinator = 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9;
    bytes32 _keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    uint256 _chainlinkFee = 0.1 * 10 ** 18;


  

constructor(uint _entryAmount) VRFConsumerBase (_vrfCoordinator, _linkToken) {
       entryAmount = _entryAmount;
       owner = msg.sender;
       deadline = block.timestamp + 24 hours;
}

    //maybe use ownable contract instead
    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function enterTheGame() public payable {
        require(msg.sender != address(0), "This address does not exist");
        require(!playerInTheGame[msg.sender], "You have already entered the lottery");
        require(msg.value >= entryAmount, "Put in at least 0.1 ether/matic to enter the lottery");
        playerInTheGame[msg.sender] = true;
        players.push(payable(msg.sender));
        //make it where they are paying 0.01 ether for every day they are in the lottery
    }

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

     function removeLotteryFunds() public onlyOwner {
       require(address(this).balance > 0, "There are no funds in the coontract");
       (bool success, ) = owner.call{value: address(this).balance}("");
       require(success, "Failed to send ether");
    }


    function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = block.timestamp > deadline;
        performData = checkData;
    }

    function performUpkeep(bytes calldata performData) external override {
       require(LINK.balanceOf(address(this)) >= _chainlinkFee, "not enough LINK");
       requestRandomness(_keyHash, _chainlinkFee);
       performData;
    }

    // function playersPayContract() public payable {
    //  address[] memory player = players;
    //   for(uint i = 0; i < players.length; i++) {
    //      if(player[i] != address(0)) {
    //        (bool success, ) =  address(this).balance.call{value: 0.01 ether}("");
    //        require(success, "Failed to send ether");
    //      }
    //   }
    //  }

    function fulfillRandomness(bytes32, uint256 randomness) internal override {
     uint256 randomWinner = randomness % players.length;
     address payable winner = players[randomWinner];
     emit Winners(winner);
   }



    function areYouIn() public view returns(bool) {
       return playerInTheGame[msg.sender];
    }

    //Use the graph to ouput who the last winner was

    receive() external payable{}
    fallback() external payable{}
}