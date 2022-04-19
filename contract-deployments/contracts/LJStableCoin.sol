//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LJStableCoin is ERC20 {
   //maybe use balanceOf function instead of tokenBalance as a way of keeping track of tokens
    mapping(address => uint) public tokenBalance;
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public stakingTimestamps;
    bool public isPaused;
    address immutable owner;
    uint256 public constant maxTotalSupply = 200000 * 10**18; //Get rid of maxSupply for StableCoin since stablecoins don't have a max supply
    uint public time;

   modifier isItPaused {
        require(isPaused == false, "This contract is currently paused");
        _;
    }

    constructor() ERC20("LJStableCoin", "LJS") {
          _mint(address(this), 100000 * 10 ** 18);
        owner = msg.sender;
    }


     function buyTokens(uint _amount) public payable isItPaused {
      uint priceOfAmount = _amount * 0.0004 ether;
      require(msg.value >= priceOfAmount, "You dont have enough funds to buy this many tokens");
      tokenBalance[msg.sender] += _amount;
      _transfer(address(this),msg.sender, _amount);
    }
       

     function sellTokens(uint _amount) public payable isItPaused {
      require(_amount <= tokenBalance[msg.sender], "You don't have this many tokens");
      uint priceOfAmount = _amount * 0.0004 ether;
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
      uint mintedTokens = uint((balance * 1000 * timeElapsed) / (1000 * 365 * 24 * 60 * 60)); //100% interest per year
      _mint(address(this), mintedTokens * 10 ** 18);
      uint newBalance = balance + mintedTokens;
      stakingBalance[msg.sender] = newBalance;
    }

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
       return tokenBalance[msg.sender] * 0.0004 ether;
    }


    function stakingBalanceInEther() public view returns(uint) {
        return stakingBalance[msg.sender] * 0.0004 ether;
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