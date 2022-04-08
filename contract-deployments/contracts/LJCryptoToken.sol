//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LJCryptoToken is ERC20 {
    //Make a section where people are able to buy 2 to 4 different types of tokens, which also includes Stablecoins
    //Also people can buy and sell these tokens and stake/earn interest off of them
    //When staking the totalSupply will have to increase and maybe not all tokens are minted at once and there can be a limit
   //Might do capped TotalSupply not mint out all tokens at once to provide staking
    mapping(address => uint) public tokenBalance;
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public stakingTimestamps;
    bool public isPaused;
    address immutable owner;
    uint256 public constant maxTotalSupply = 200000 * 10**18;
    uint public time;

    constructor() ERC20("LJCryptoToken", "LJC") {
         _mint(address(this), 100000 * 10 ** 18);
         owner = msg.sender;
    }

    modifier isItPaused {
        require(isPaused == false, "This contract is currently paused");
        _;
    }

    // function currentPricePerToken() public view returns(uint) {
    //     return address(this).balance/(totalSupply());
    // }

     function currentPricePerToken() public view returns(uint) {
        return address(this).balance/(totalSupply()/10 ** 18);
    }


   //The user might not be able to buy one whole of a token
    function buyTokens(uint _amount) public payable isItPaused {
      uint priceOfAmount = _amount * currentPricePerToken();
      require(msg.value >= priceOfAmount, "You dont have enough funds to buy this many tokens");
      tokenBalance[msg.sender] += _amount;
      _transfer(address(this),msg.sender, _amount);
    }
       

     function sellTokens(uint _amount) public payable isItPaused {
      require(_amount <= tokenBalance[msg.sender], "You don't have this many tokens");
      uint priceOfAmount = _amount * currentPricePerToken();
      tokenBalance[msg.sender] -= _amount;
       _transfer(msg.sender, address(this), _amount);
      payable(msg.sender).transfer(priceOfAmount);
    }

     function stakeTokens(uint _amount) public isItPaused {
      require(tokenBalance[msg.sender] >= _amount, "You do not have this many tokens");
      tokenBalance[msg.sender] -= _amount;
      stakingBalance[msg.sender] += _amount;
      stakingTimestamps[msg.sender] = block.timestamp;
    }

     function unstakeTokens(uint _amount) public isItPaused {
       stakedBalance();
       require(_amount <= stakingBalance[msg.sender], "You don't have this many tokens staked");
       stakingBalance[msg.sender] -= _amount;
       tokenBalance[msg.sender] += _amount;
       if(stakingBalance[msg.sender] == 0) {
           stakingTimestamps[msg.sender] = 0;
       }
    } 

    function stakedBalance() public returns(uint) {
      require(totalSupply() <= maxTotalSupply, "We have reached the maxiumum supply");
      uint balance = stakingBalance[msg.sender];
      require(balance > 0, "You don't have any staked tokens");
      time = block.timestamp;
      uint timeElapsed = time - stakingTimestamps[msg.sender]; //seconds
      uint mintedTokens = uint((balance * 100000 * timeElapsed) / (1000 * 365 * 24 * 60 * 60)); //10000% interest per year
      _mint(address(this), mintedTokens * 10 ** 18);
      uint newBalance = balance + mintedTokens;
      stakingBalance[msg.sender] = newBalance;
      return newBalance; 
    }

    //Maybe refactor the balance in terms of the staked tokens and the staked tokens accuring interest
    //Maybe just combine the stakeTokens and stakedBalance() functions
    function balanceOfContract() public view returns(uint) {
       return address(this).balance;
   }
   

   function getMsgSender() public view returns(address) {
       return msg.sender;
   }

    function receiveBalance() public view returns(uint) {
      return address(msg.sender).balance;
   }


    function userBalanceInEther() public view returns(uint) {
       return tokenBalance[msg.sender] * currentPricePerToken();
    }

    //Make a function for the staked balance in ether

    function stakingBalanceInEther() public view returns(uint) {
        return stakingBalance[msg.sender] * currentPricePerToken();
    }

    function setPauseValue(bool value) public {
        require(msg.sender == owner, "You are not the owner");
        isPaused = value;
    }

    function removeFunds() public payable{
        require(msg.sender == owner, "You are not the owner");
        payable(msg.sender).transfer(address(this).balance);
    }
    
}


