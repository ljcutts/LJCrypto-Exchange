//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}


contract LJCryptoNFTCollection is ERC1155, VRFConsumerBase {
    //make an ERC1155 contract that will be used to get into the DAO
    //users will have to pay a certain amount for the ERC1155 tokens and the ether amount will get sent to the DAO contract
    //make ERC721s for the NFT Marketplace
    //Maybe use Chainlink VRF where someone can get a random NFT where there's 10 different NFTs
    //depending on the number NFT you get is the amount of propsoals you can vote and create id 10 will give you 10 votes/creates for example
    using Counters for Counters.Counter;
    Counters.Counter private _currentSupply;
    bool public _paused;
    address immutable owner;
    address constant _linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    address constant _vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
    bytes32 constant _keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    uint constant _chainlinkFee = 0.1 * 10 ** 18;
    uint randomNumber = 1;
    uint time;
    // uint32 public constant TIER1 = 0;
    // uint32 public constant TIER2 = 1;
    // uint32 public constant TIER3 = 2;
    // uint32 public constant TIER4 = 3;
    // uint32 public constant TIER5 = 4;
    // uint32 public constant TIER6 = 5;
    // uint32 public constant TIER7 = 6;
    // uint32 public constant TIER8 = 7;
    // uint128 public constant TIER9 = 8;
    // uint128 public constant TIER10 = 9;
    // uint256 public constant STAKING = 10;
   mapping(address => uint) stakingBalance;
   mapping(address => uint) public stakingTimestamps;
    constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmdTLaJeFdRwgMvBynK892uG8mAuSN9UYvkG9R2QPRsd4b/{id}.json") VRFConsumerBase(_vrfCoordinator, _linkToken)  {
         owner = msg.sender;
    }

     modifier onlyWhenNotPaused {
            require(!_paused, "Contract currently paused");
            _;
        }
     
   function mintToken() public payable onlyWhenNotPaused {
    require(_currentSupply.current() < 1000, "We have reached the maxiumum supply");
    require(randomNumber > 0, "A random number hasn't been generated yet");
    uint tokenAmount = 0.01 ether;
    require(msg.value >= tokenAmount, "You didn't pay enough to receive NFT");
    uint randomId = randomNumber % 10;
    _mint(msg.sender, randomId, 1, "");
    _mint(msg.sender, 9, 1, "");
    _mint(msg.sender, 7, 1, "");
    _mint(msg.sender, 8, 1, "");
    _mint(msg.sender, 8, 1, "");
    _currentSupply.increment();
    uint balance = totalNFTBalance();
    if(balance >= 10 && stakingTimestamps[msg.sender] == 0) {
       stakingTimestamps[msg.sender] = block.timestamp;
    }
    // randomNumber = 0;
   }

    function checkUpkeep(bytes calldata /*checkData*/) external view returns (bool upkeepNeeded, bytes memory /*performData*/) {
        bool hasLink = LINK.balanceOf(address(this)) >= _chainlinkFee;
        bool numberIsZero = randomNumber == 0;
        upkeepNeeded = hasLink && numberIsZero;
    }

    function performUpkeep(bytes calldata /*performData*/) external {
       require(LINK.balanceOf(address(this)) >= _chainlinkFee, "not enough LINK");
       requestRandomness(_keyHash, _chainlinkFee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
     randomNumber = randomness;
   }

    function totalNFTBalance()
        public
        view
        virtual
        returns (uint256)
    {
        uint amountofNFTs;
        for (uint256 i = 0; i < 10; ++i) {
            uint nftCount = balanceOf(msg.sender, i);
            amountofNFTs += nftCount;
        }

        return amountofNFTs;
    }



   function updateStakingBalance() public {
      uint balance = totalNFTBalance();
      if(balance < 10) {
          stakingTimestamps[msg.sender] = 0;
      }
      require(balance >= 10, "You need to keep 10 NFTs or more in your account");
      time = block.timestamp;
      uint timeElapsed = time - stakingTimestamps[msg.sender]; //seconds
      uint mintedTokens = uint(balance * 1000 * timeElapsed) / (1000 * 365 * 24 * 60 * 60); //100% interest per year
      stakingBalance[msg.sender] += mintedTokens;
    }

    function claimNFTStakingRewards(uint _amount) public {
      updateStakingBalance();
      require(stakingBalance[msg.sender] >= _amount, "Your staking balance is not this high");
      stakingBalance[msg.sender] -= _amount;
     _mint(msg.sender, 10, _amount, "");
    }

    function checkStakingBalance() public view returns (uint) {
        return stakingBalance[msg.sender];
    }

   function setPause(bool _value) public {
       require(msg.sender == owner, "You are not the owner");
       _paused = _value;
   }

   function burn(address user, uint id, uint amount) public {
       require(msg.sender == user, "You can only get rid of your own token");
       _burn(user, id, amount);
      uint balance = totalNFTBalance();
      if(balance < 10) {
          stakingTimestamps[msg.sender] = 0;
      }
   }

   function uri(uint _tokenId) override public pure returns(string memory) {
       return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/QmdTLaJeFdRwgMvBynK892uG8mAuSN9UYvkG9R2QPRsd4b/", Strings.toString(_tokenId), ".json"));
   }

         function withdraw() public  {
            require(msg.sender == owner, "You are not the owner");
            uint256 amount = address(this).balance;
            (bool sent, ) =  payable(msg.sender).call{value: amount}("");
            require(sent, "Failed to send Ether");
        }

         // Function to receive Ether. msg.data must be empty
        receive() external payable {}

        // Fallback function is called when msg.data is not empty
        fallback() external payable {}

}