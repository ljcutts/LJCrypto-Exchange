//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LJCryptoToken is ERC20 {
    //Make a section where people are able to buy 2 to 4 different types of tokens, which also includes Stablecoins
    //Also people can buy and sell these tokens and stake/earn interest off of them
    //When staking the totalSupply will have to increase and maybe not all tokens are minted at once and there can be a limit
   //Might do capped TotalSupply not mint out all tokens at once to provide staking
    mapping(address => uint) private tokenBalance;
    mapping(address => uint) private stakingBalance;
    mapping(address => uint) stakingTimestamps;
    bool public isPaused;
    address immutable owner;
    

    constructor() ERC20("LJCryptoToken", "LJC") {
         _mint(msg.sender, 1000000 * 10 ** 18);
         owner = msg.sender;
    }

    function currentPricePerToken() public view returns(uint) {
        return address(this).balance/1000000;
    }

    modifier isItPaused {
        require(isPaused == false, "This contract is currently paused");
        _;
    }

   //The user might not be able to buy one whole of a token
    function buyTokens(uint _amount) public payable isItPaused {
      uint priceOfAmount = _amount * currentPricePerToken();
      require(msg.value >= priceOfAmount, "You dont have enough funds to buy this many tokens");
      tokenBalance[msg.sender] += _amount;
    }

     function sellTokens(uint _amount) public payable isItPaused {
      uint priceOfAmount = _amount * currentPricePerToken();
      require(_amount <= tokenBalance[msg.sender], "You don't have this many tokens");
      tokenBalance[msg.sender] -= _amount;
      payable(msg.sender).transfer(priceOfAmount);
    }

     function stakeTokens(uint _amount) public isItPaused {
      require(tokenBalance[msg.sender] >= _amount, "You do not have this many tokens");
      tokenBalance[msg.sender] -= _amount;
      stakingBalance[msg.sender] += _amount;
      stakingTimestamps[msg.sender] = block.timestamp;
    }

     function unstakeTokens(uint _amount) public isItPaused {
       require(_amount <= stakingBalance[msg.sender], "You don't have this many tokens staked");
       stakingBalance[msg.sender] -= _amount;
       if(stakingBalance[msg.sender] == 0) {
           stakingTimestamps[msg.sender] = 0;
       }
    }

    function stakedBalance() public view returns(uint) {
      uint balance = stakingBalance[msg.sender];
      require(balance > 0, "You don't have any staked tokens");
      uint timeElapsed = block.timestamp - stakingTimestamps[msg.sender]; //seconds
      return balance + uint((balance * 1000 * timeElapsed) / (100 * 365 * 24 * 60 * 60)) + 1; //10% interest per year
    }

    function userBalanceInEther() public view returns(uint) {
       return tokenBalance[msg.sender] * currentPricePerToken();
    }

    function setPauseValue(bool value) public {
        require(msg.sender == owner, "You are not the owner");
        isPaused = value;
    }

    //  principal + uint((principal * 7 * timeElapsed) / (100 * 365 * 24 * 60 * 60)) + 1; //simple interest of 0.07%  per year
}


/*
pragma solidity >=0.7.0 <0.9.0;

contract SmartBankAccount {

    uint totalContractBalance = 0;

    function getContractBalance() public view returns(uint){
        return totalContractBalance;
    }
    
    mapping(address => uint) balances;
    mapping(address => uint) depositTimestamps;
    
    function addBalance() public payable {
        balances[msg.sender] = msg.value;
        totalContractBalance = totalContractBalance + msg.value;
        depositTimestamps[msg.sender] = block.timestamp;
    }
    
    function getBalance(address userAddress) public view returns(uint) {
        uint principal = balances[userAddress];
        uint timeElapsed = block.timestamp - depositTimestamps[userAddress]; //seconds
        return principal + uint((principal * 7 * timeElapsed) / (100 * 365 * 24 * 60 * 60)) + 1; //simple interest of 0.07%  per year
    }
    
    function withdraw() public payable {
        address payable withdrawTo = payable(msg.sender);
        uint amountToTransfer = getBalance(msg.sender);
        withdrawTo.transfer(amountToTransfer);
        totalContractBalance = totalContractBalance - amountToTransfer;
        balances[msg.sender] = 0;
    }
    
    function addMoneyToContract() public payable {
        totalContractBalance += msg.value;
    }

    
}

*/