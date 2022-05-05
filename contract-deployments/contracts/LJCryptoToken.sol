//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LJCryptoToken is ERC20 {
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public stakingTimestamps; 
    bool public isPaused;
    address immutable owner;
    uint256 public constant maxTotalSupply = 200000 * 10**18;

    constructor() ERC20("LJCryptoToken", "LJC") {
         _mint(address(this), 100000 * 10 ** 18);
         owner = msg.sender;
    }

    modifier isItPaused {
        require(isPaused == false, "CONTRACT_IS_PAUSED");
        _;
    }

     function currentPricePerTokenInEther() public view returns(uint) {
        return address(this).balance/(totalSupply()/10 ** 18);
    }


   //The user might not be able to buy one whole of a token
    function buyTokens(uint _amount) external payable isItPaused {
      uint priceOfAmount = _amount * currentPricePerTokenInEther();
      require(msg.value > 0 && msg.value >= priceOfAmount, "INSUFFICIENT_FUNDS");
      _transfer(address(this), msg.sender, (_amount * 10 ** 18));
    }
       

     function sellTokens(uint _amount) external payable isItPaused {
      uint priceOfAmount = _amount * currentPricePerTokenInEther();
       _transfer(msg.sender, address(this), (_amount * 10 ** 18));
       payable(msg.sender).transfer(priceOfAmount);
    }

     function stakeTokens(uint _amount) external isItPaused {
      require(totalSupply() < maxTotalSupply, "MAXIUMUM_SUPPLY_REACHED");
       stakingBalance[msg.sender] += _amount;
      _transfer(msg.sender, address(this), (_amount * 10 ** 18));
      if(stakingTimestamps[msg.sender] == 0) {
        stakingTimestamps[msg.sender] = block.timestamp;
      }
    }

     function unstakeTokens(uint _amount) external isItPaused {
       if(totalSupply() >= maxTotalSupply) {
         uint amount = stakingBalance[msg.sender];
         stakingBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, (amount * 10 ** 18));
       } else {
       stakedBalance();
       require(_amount <= stakingBalance[msg.sender], "INSUFFICIENT_STAKE_BALANCE");
       stakingBalance[msg.sender] -= _amount;
      _transfer(address(this), msg.sender, (_amount * 10 ** 18));
       if(stakingBalance[msg.sender] == 0) {
           stakingTimestamps[msg.sender] = 0;
        }
       }
    } 

    function stakedBalance() public {
      require(totalSupply() <= maxTotalSupply, "MAXIUMUM_SUPPLY_REACHED");
      uint balance = stakingBalance[msg.sender];
      require(balance > 0, "NO_BALANCE");
      uint time = block.timestamp;
      uint timeElapsed = time - stakingTimestamps[msg.sender]; //seconds
      uint mintedTokens = uint((balance * 100000 * timeElapsed) / (1000 * 365 * 24 * 60 * 60)); //10000% interest per year
      _mint(address(this), (mintedTokens * 10 ** 18));
      uint newBalance = balance + mintedTokens;
      stakingBalance[msg.sender] = newBalance;
    }

  //   function balanceOfContract() public view returns(uint) {
  //      return address(this).balance;
  //  }
   

  //  function getMsgSender() public view returns(address) {
  //      return msg.sender;
  //  }

  //   function receiveBalance() public view returns(uint) {
  //     return address(msg.sender).balance;
  //  }


    function userBalanceInEther() external view returns(uint) {
       return  (balanceOf(msg.sender)/1e18) * currentPricePerTokenInEther();
    }


    function stakingBalanceInEther() external view returns(uint) {
        return stakingBalance[msg.sender] * currentPricePerTokenInEther();
    }

    function setPauseValue(bool value) external {
        require(msg.sender == owner, "NOT_OWNER");
        isPaused = value;
    }

    function removeFunds() external payable {
        require(msg.sender == owner, "NOT_OWNER");
        payable(msg.sender).transfer(address(this).balance);
    }
    
}


