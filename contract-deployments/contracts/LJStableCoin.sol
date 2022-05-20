//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LJStableCoin is ERC20 {
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public stakingTimestamps;
    bool public isPaused;
    address immutable owner;

   modifier isItPaused {
        require(isPaused == false, "CONTRACT_IS_PAUSED");
        _;
    }

    constructor() ERC20("LJStableCoin", "LJS") {
        _mint(address(this), 100000 * 10 ** 18);
        owner = msg.sender;
    }


     function buyTokens(uint _amount) external payable isItPaused {
      require(_amount != 0, "NO_AMOUNT_SPECIFIED");
      uint priceOfAmount = _amount * 0.0004 ether;
      require(msg.value >= priceOfAmount, "INSUFFICIENT_FUNDS");
      _transfer(address(this), msg.sender, (_amount * 10 ** 18));
    }
       

     function sellTokens(uint _amount) external payable isItPaused {
      require(_amount != 0, "NO_AMOUNT_SPECIFIED");
      uint priceOfAmount = _amount * 0.0004 ether;
       _transfer(msg.sender, address(this), (_amount * 10 ** 18));
      payable(msg.sender).transfer(priceOfAmount);
    }

     function stakeTokens(uint _amount) external isItPaused {
      require(_amount != 0, "NO_AMOUNT_SPECIFIED");
      stakingBalance[msg.sender] += _amount;
      _transfer(msg.sender, address(this), (_amount * 10 ** 18));
       if(stakingTimestamps[msg.sender] == 0) {
        stakingTimestamps[msg.sender] = block.timestamp;
      }
    }

     function unstakeTokens(uint _amount) external isItPaused {
        require(_amount != 0, "NO_AMOUNT_SPECIFIED");
       stakedBalance();
       require(_amount <= stakingBalance[msg.sender], "INSUFFICIENT_STAKE_BALANCE");
       stakingBalance[msg.sender] -= _amount;
       _transfer(address(this), msg.sender, (_amount * 10 ** 18));
       if(stakingBalance[msg.sender] == 0) {
           stakingTimestamps[msg.sender] = 0;
       }
    } 

    function stakedBalance() public {
      uint balance = stakingBalance[msg.sender];
      require(balance > 0, "NO_BALANCE");
      uint time = block.timestamp;
      uint timeElapsed = time - stakingTimestamps[msg.sender]; //seconds
      uint mintedTokens = uint((balance * 1000 * timeElapsed) / (1000 * 365 * 24 * 60 * 60)); //100% interest per year
      _mint(address(this), (mintedTokens * 10 ** 18));
      uint newBalance = balance + mintedTokens;
      stakingBalance[msg.sender] = newBalance;
    }

    function userBalanceInEther() external view returns(uint) {
       return (balanceOf(msg.sender)/1e18) * 0.0004 ether;
    }


    function stakingBalanceInEther() external view returns(uint) {
        return stakingBalance[msg.sender] * 0.0004 ether;
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