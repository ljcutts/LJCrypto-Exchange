//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract LJStableCoin is ERC20 {
  bool public isPaused;
  address immutable owner;
  mapping(address => uint) public tokenBalance;

   modifier isItPaused {
        require(isPaused == false, "This contract is currently paused");
        _;
    }

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Rinkeby
     * Aggregator: USDC/USD
     * Address: 0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB
     */
    constructor(address _priceFeed) ERC20("LJStableCoin", "LJS") {
          _mint(address(this), 100000 * 10 ** 18);
        priceFeed = AggregatorV3Interface(_priceFeed);
        owner = msg.sender;
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            , 
            int price,
            ,
            ,
        ) = priceFeed.latestRoundData();
        return price;
    }


     function buyTokens(uint _amount) public payable isItPaused {
      uint priceOfAmount = _amount * uint(getLatestPrice());
      require(msg.value >= priceOfAmount, "You dont have enough funds to buy this many tokens");
      tokenBalance[msg.sender] += _amount;
      _transfer(address(this),msg.sender, _amount);
    }
       

     function sellTokens(uint _amount) public payable isItPaused {
      require(_amount <= tokenBalance[msg.sender], "You don't have this many tokens");
      uint priceOfAmount = _amount * uint(getLatestPrice());
      tokenBalance[msg.sender] -= _amount;
       _transfer(msg.sender, address(this), _amount);
      payable(msg.sender).transfer(priceOfAmount);
    }
}