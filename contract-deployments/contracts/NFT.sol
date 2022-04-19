//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract NFT is ERC1155 {
    //make an ERC1155 contract that will be used to get into the DAO
    //users will have to pay a certain amount for the ERC1155 tokens and the ether amount will get sent to the DAO contract
    //make ERC721s for the NFT Marketplace
    //Maybe use Chainlink VRF where someone can get a random NFT where there's 3 different NFTs
    using Counters for Counters.Counter;
    Counters.Counter private _currentSupply;
    bool public _paused;
    address immutable owner;

    constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmdTLaJeFdRwgMvBynK892uG8mAuSN9UYvkG9R2QPRsd4b/{id}.json"){
         owner = msg.sender;
    }

     modifier onlyWhenNotPaused {
            require(!_paused, "Contract currently paused");
            _;
        }
     
   function mintToken() public payable onlyWhenNotPaused {
    require(_currentSupply.current() < 100, "We have reached the maxiumum supply");
    uint tokenAmount = 0.01 ether;
    require(msg.value >= tokenAmount, "You didn't pay enough to receive NFT");
    _mint(msg.sender, 1, 1, "");
    _currentSupply.increment();
   }

   function setPause(bool _value) public {
       require(msg.sender == owner, "You are not the owner");
       _paused = _value;
   }

   function burn(address user, uint id, uint amount) public {
       require(msg.sender == user, "You can only get rid of your own token");
       _burn(user, id, amount);
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