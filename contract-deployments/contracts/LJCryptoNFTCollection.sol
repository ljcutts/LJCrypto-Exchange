//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}


contract LJCryptoNFTCollection is ERC1155, VRFConsumerBase {
    using Counters for Counters.Counter;
    Counters.Counter private _currentSupply;
    bool public _paused;
    address immutable owner;
    address constant _linkToken = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address constant _vrfCoordinator = 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255;
    bytes32 constant _keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    uint constant _chainlinkFee = 0.0001 * 10 ** 18;
    uint randomNumber;
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
    constructor() ERC1155("https://ipfs.io/ipfs/QmezZXvvU2NjEsPPfnceAuZLzgmvcv6V1MaPpbZLNcAWkQ/{id}.json") VRFConsumerBase(_vrfCoordinator, _linkToken)  {
         owner = msg.sender;
    }

     modifier onlyWhenNotPaused {
            require(!_paused, "PAUSED");
            _;
        }
     
   function mintToken() external payable onlyWhenNotPaused {
    require(_currentSupply.current() < 1000, "MAXIMUM_SUPPLY_REACHED");
    require(randomNumber > 0, "NO_GENERATION");
    uint tokenAmount = 0.01 ether;
    require(msg.value >= tokenAmount, "INSUFFICIENT_FUNDS");
    uint randomId = randomNumber % 10;
    _mint(msg.sender, randomId, 1, "");
    _currentSupply.increment();
    randomNumber = 0;
   }

    function checkUpkeep(bytes calldata /*checkData*/) external view returns (bool upkeepNeeded, bytes memory /*performData*/) {
        bool hasLink = LINK.balanceOf(address(this)) >= _chainlinkFee;
        bool numberIsZero = randomNumber == 0;
        upkeepNeeded = hasLink && numberIsZero;
    }

    function performUpkeep(bytes calldata /*performData*/) external {
       require(LINK.balanceOf(address(this)) >= _chainlinkFee, "MORE_LINK");
       requestRandomness(_keyHash, _chainlinkFee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
     randomNumber = randomness;
   }

    function totalNFTBalance()
        external
        view
        virtual
        returns (uint256)
    {
        uint amountofNFTs;
        for (uint256 i = 0; i < 12; ++i) {
            uint nftCount = balanceOf(msg.sender, i);
            amountofNFTs += nftCount;
        }

        return amountofNFTs;
    }

    function breedNFTs(uint[2] memory ids) external {
       for(uint i = 0; i < ids.length; ++i) {
           burn(msg.sender, ids[i], 1);
       }
        _mint(msg.sender, 11, 1, "");
    }
    
   function setPause(bool _value) external {
       require(msg.sender == owner, "NOT_OWNER");
       _paused = _value;
   }

   function burn(address user, uint id, uint amount) public onlyWhenNotPaused {
       require(msg.sender == user, "BURN_ONLY_YOUR_TOKENS");
       _burn(user, id, amount);
   }

   function uri(uint _tokenId) override public pure returns(string memory) {
       return string(abi.encodePacked("https://ipfs.io/ipfs/QmezZXvvU2NjEsPPfnceAuZLzgmvcv6V1MaPpbZLNcAWkQ/", Strings.toString(_tokenId), ".json"));
   }

   function mintTokensToStakingContract(address _stakingContract, uint _amount) external onlyWhenNotPaused {
        require(msg.sender == owner, "NOT_OWNER");
        _mint(_stakingContract, 10, _amount, "");
   }

   function numberAboveZero() external view returns(bool) {
      return randomNumber > 0;
   }

         function withdraw() external {
            require(msg.sender == owner, "NOT_OWNER");
            uint256 amount = address(this).balance;
            (bool sent, ) =  payable(msg.sender).call{value: amount}("");
            require(sent, "SEND_FAILED");
        }

         // Function to receive Ether. msg.data must be empty
        receive() external payable {}

        // Fallback function is called when msg.data is not empty
        fallback() external payable {}

}