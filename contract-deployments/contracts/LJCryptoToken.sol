//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LJCryptoToken is ERC20 {
  //maybe use balanceOf function instead of tokenBalance as a way of keeping track of tokens
    mapping(address => uint) public tokenBalance;
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public stakingTimestamps;
    bool public isPaused;
    address immutable owner;
    uint256 public constant maxTotalSupply = 200000 * 10**18;
    uint time;

    constructor() ERC20("LJCryptoToken", "LJC") {
         _mint(address(this), 100000 * 10 ** 18);
         owner = msg.sender;
    }

    modifier isItPaused {
        require(isPaused == false, "This contract is currently paused");
        _;
    }

     function currentPricePerTokenInEther() public view returns(uint) {
        return address(this).balance/(totalSupply()/10 ** 18);
    }


   //The user might not be able to buy one whole of a token
    function buyTokens(uint _amount) public payable isItPaused {
      uint priceOfAmount = _amount * currentPricePerTokenInEther();
      require(msg.value >= priceOfAmount, "You dont have enough funds to buy this many tokens");
      tokenBalance[msg.sender] += _amount;
      _transfer(address(this),msg.sender, _amount);
    }
       

     function sellTokens(uint _amount) public payable isItPaused {
      require(_amount <= tokenBalance[msg.sender], "You don't have this many tokens");
      uint priceOfAmount = _amount * currentPricePerTokenInEther();
      tokenBalance[msg.sender] -= _amount;
       _transfer(msg.sender, address(this), _amount);
      payable(msg.sender).transfer(priceOfAmount);
    }

     function stakeTokens(uint _amount) public isItPaused {
      require(totalSupply() <= maxTotalSupply, "We have reached the maxiumum supply");
      require(tokenBalance[msg.sender] >= _amount, "You do not have this many tokens");
      tokenBalance[msg.sender] -= _amount;
      stakingBalance[msg.sender] += _amount;
      stakingTimestamps[msg.sender] = block.timestamp;
    }

     function unstakeTokens(uint _amount) public isItPaused {
       if(totalSupply() >= maxTotalSupply) {
         uint amount = stakingBalance[msg.sender];
         stakingBalance[msg.sender] -= amount;
         tokenBalance[msg.sender] += amount;
       } else {
       stakedBalance();
       require(_amount <= stakingBalance[msg.sender], "You don't have this many tokens staked");
       stakingBalance[msg.sender] -= _amount;
       tokenBalance[msg.sender] += _amount;
       if(stakingBalance[msg.sender] == 0) {
           stakingTimestamps[msg.sender] = 0;
        }
       }
    } 

    function stakedBalance() public {
      require(totalSupply() <= maxTotalSupply, "We have reached the maxiumum supply");
      uint balance = stakingBalance[msg.sender];
      require(balance > 0, "You don't have any staked tokens");
      time = block.timestamp;
      uint timeElapsed = time - stakingTimestamps[msg.sender]; //seconds
      uint mintedTokens = uint((balance * 100000 * timeElapsed) / (1000 * 365 * 24 * 60 * 60)); //10000% interest per year
      _mint(address(this), mintedTokens * 10 ** 18);
      uint newBalance = balance + mintedTokens;
      stakingBalance[msg.sender] = newBalance;
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
       return tokenBalance[msg.sender] * currentPricePerTokenInEther();
    }

    //Make a function for the staked balance in ether

    function stakingBalanceInEther() public view returns(uint) {
        return stakingBalance[msg.sender] * currentPricePerTokenInEther();
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


