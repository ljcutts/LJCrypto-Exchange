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

   constructor(address _ljcryptoNFT) {
     owner = msg.sender;
     LJCryptoNFT = ILJCryptoNFT(_ljcryptoNFT);
  }

   modifier onlyWhenNotPaused {
            require(!_paused, "Contract currently paused");
            _;
        }

function totalNFTBalance()
        public
        view
        virtual
        returns (uint256)
    {
        uint amountofNFTs;
        for (uint256 i = 0; i < 10; ++i) {
            uint nftCount = LJCryptoNFT.balanceOf(msg.sender, i);
            amountofNFTs += nftCount;
        }

        return amountofNFTs;
    }

  function stakeNFTs(uint[] memory ids) public onlyWhenNotPaused {
        uint balance = totalNFTBalance();
        require(balance >= 10, "You dont have enough NFTs to stake");
        require(ids.length >= 10, "You have to transfer 10 or more NFTs to start staking");
          for (uint256 i = 0; i < ids.length; ++i) {
           LJCryptoNFT.safeTransferFrom(msg.sender, address(this), ids[i], 1, "");
           stakingBalance[msg.sender]++;
           originalBalance[msg.sender]++;
        }
        if(stakingTimestamps[msg.sender] == 0) {
            stakingTimestamps[msg.sender] = block.timestamp;
        }
    }

    function unstakeNFTs(uint[] memory ids) public onlyWhenNotPaused {
        require(stakingTimestamps[msg.sender] > 0, "You don't have any NFTs staked");
        require(ids.length >= 10, "You need to unstake 10 or more NFTs from your original balance");
        for (uint256 i = 0; i < ids.length; ++i) {
           LJCryptoNFT.safeTransferFrom(address(this), msg.sender, ids[i], 1, "");
           stakingBalance[msg.sender]--;
           originalBalance[msg.sender]--;
        }
        if(stakingBalance[msg.sender] < 10) {
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

    function checkStakingBalance() public view returns (uint) {
        return stakingBalance[msg.sender];
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