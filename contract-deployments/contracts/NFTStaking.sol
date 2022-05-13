//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

interface ILJCryptoNFT {
   function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
   function balanceOf(address account, uint256 id) external view returns(uint);
}

contract NFTStaking is ERC1155Holder {
  ILJCryptoNFT LJCryptoNFT;

   address immutable owner;
   bool public _paused;
   mapping(address => uint) stakingBalance;
   mapping(address => uint) originalBalance;
   mapping(address => uint) public stakingTimestamps;
   mapping(uint => mapping(address => uint)) stakedNFTs;

   constructor(address _ljcryptoNFT) {
     owner = msg.sender;
     LJCryptoNFT = ILJCryptoNFT(_ljcryptoNFT);
  }

   modifier onlyWhenNotPaused {
            require(!_paused, "Contract currently paused");
            _;
        }

  function stakeNFTs(uint[] memory ids) external onlyWhenNotPaused {
        require(ids.length >= 10, "You have to transfer 10 or more NFTs to start staking");
        require(ids.length % 10 == 0, "HAVE_TO_BE_DIVISIBLE_BY_10");
          for (uint256 i = 0; i < ids.length; ++i) {
           stakingBalance[msg.sender]++;
           originalBalance[msg.sender]++;
           stakedNFTs[ids[i]][msg.sender]++;
           LJCryptoNFT.safeTransferFrom(msg.sender, address(this), ids[i], 1, "");
        }
        if(stakingTimestamps[msg.sender] == 0) {
            stakingTimestamps[msg.sender] = block.timestamp;
        }
    }

    function unstakeNFTs(uint[] memory ids) external onlyWhenNotPaused {
        require(stakingTimestamps[msg.sender] > 0, "You don't have any NFTs staked");
        require(ids.length >= 10, "You need to unstake 10 or more NFTs from your original balance");
        updateStakingBalance();
        uint balance = stakingBalance[msg.sender];
        for (uint256 i = 0; i < ids.length; ++i) {
           stakingBalance[msg.sender]--;
           originalBalance[msg.sender]--;
           stakedNFTs[ids[i]][msg.sender]--;
           LJCryptoNFT.safeTransferFrom(address(this), msg.sender, ids[i], 1, "");
        }
        if(stakingBalance[msg.sender] < 10) {
          uint idLength = ids.length;
          uint difference = balance - idLength;
          if(difference > 0) {
               claimNFTStakingRewards(difference);
          }
            stakingTimestamps[msg.sender] = 0;
            stakingBalance[msg.sender] = 0;
            originalBalance[msg.sender] = 0;
        }
    }

   function updateStakingBalance() public  {
     require(stakingTimestamps[msg.sender] > 0, "You are not currently staking NFTs");
      uint balance = stakingBalance[msg.sender];
      uint time = block.timestamp;
      uint timeElapsed = time - stakingTimestamps[msg.sender]; //seconds
      uint mintedTokens = uint(balance * 10000 * timeElapsed) / (1000 * 365 * 24 * 60 * 60); //1000% interest per year
      uint newBalance = balance + mintedTokens;
      stakingBalance[msg.sender] = newBalance;
    }


    function claimNFTStakingRewards(uint _amount) public onlyWhenNotPaused {
      updateStakingBalance();
      require((stakingBalance[msg.sender] - originalBalance[msg.sender]) >= _amount, "You have not earned any staking rewards yet");
      stakingBalance[msg.sender] -= _amount;
      LJCryptoNFT.safeTransferFrom(address(this), msg.sender, 10, _amount, "");
    }

    function checkStakingBalance() external view returns (uint) {
        return stakingBalance[msg.sender];
    }

    function checkStakedNFTs(uint _id) external view returns(uint) {
       return stakedNFTs[_id][msg.sender];
    }

     function withdraw() external  {
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