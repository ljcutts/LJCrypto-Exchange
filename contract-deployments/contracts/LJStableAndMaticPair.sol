// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract LJStableAndMaticPair is ERC20 {
   address public LJStableCoinAddress;
   mapping(address => uint) userMaticBalance;
   mapping(address => uint) ljstableBalance;
    constructor(address _LJStableCoinAddress) ERC20("LJS/Matic LP Token", "LJLP") {
    require(_LJStableCoinAddress != address(0), "NOT_AN_ADDRESS");
       LJStableCoinAddress = _LJStableCoinAddress;
    }

    
function getLJStableReserve() public view returns(uint) {
    return IERC20(LJStableCoinAddress).balanceOf(address(this));
}

function addLiquidity(uint _amountA) external payable returns(uint) {
    require(_amountA > 0 && msg.value > 0, 'CANT_BE_ZERO');
    uint LJStablePrice = 0.0004 ether;
    uint LJStableAmount = _amountA * LJStablePrice;
    uint MaticAmount = msg.value;
    require(LJStableAmount >= MaticAmount || MaticAmount >= LJStableAmount, "NOT_BALANCED");
    uint liquidity;
    uint maticBalance = address(this).balance;
     uint LJStableReserve = getLJStableReserve();
     IERC20 LJStableCoin = IERC20(LJStableCoinAddress);
    if(LJStableReserve == 0) {
        userMaticBalance[msg.sender] += msg.value;
        ljstableBalance[msg.sender] += _amountA;
       LJStableCoin.transferFrom(msg.sender, address(this), _amountA);
       liquidity = maticBalance;
       _mint(msg.sender, liquidity);
    } else {
        uint maticReserve = maticBalance - msg.value;
        uint ljstableCoinAmount = (msg.value * LJStableReserve)/(maticReserve);
         require(_amountA >= ljstableCoinAmount, "INSUFFICIENT_AMOUNT");
         userMaticBalance[msg.sender] += msg.value;
         ljstableBalance[msg.sender] += _amountA;
         LJStableCoin.transferFrom(msg.sender, address(this), ljstableCoinAmount);
        liquidity = (totalSupply() * msg.value)/ maticReserve;
        _mint(msg.sender, liquidity);
    }
    return liquidity;
}

function removeLiquidity(uint _amountA, uint _amountB) external returns(uint, uint) {
    require(_amountA > 0 && _amountB > 0, 'CANT_BE_ZERO');
    uint LJStablePrice = 0.0004 ether;
    uint LJStableAmount = _amountA * LJStablePrice;
    uint MaticAmount = _amountB;
    require(LJStableAmount >= MaticAmount || MaticAmount >= LJStableAmount, "NOT_BALANCED");
    uint maticReserve = address(this).balance;
    uint _totalSupply = totalSupply();
    uint maticAmount = (maticReserve * (_amountB/1e18))/ _totalSupply;
    uint ljstableCoinAmount = (getLJStableReserve() * (_amountA/1e18))/ _totalSupply;
    ljstableBalance[msg.sender] -= ljstableCoinAmount;
    userMaticBalance[msg.sender] -= maticAmount;
    _burn(msg.sender, _amountA);
    payable(msg.sender).transfer(maticAmount);
    IERC20(LJStableCoinAddress).transfer(msg.sender, ljstableCoinAmount);
    return (maticAmount, ljstableCoinAmount);
}


    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "INVALID_RESERVES");
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

      /**
     @dev Swaps Matic for LJCStableCoin Tokens
    */
    function maticToLJStableCoinToken(uint _minTokens) external payable {
   uint256 ljstableCoinReserve = getLJStableReserve();
    uint256 tokensBought = getAmountOfTokens(
        msg.value,
        address(this).balance - msg.value,
        ljstableCoinReserve
    );

    require(tokensBought >= _minTokens, "INSUFFICIENT_AMOUNT");
    IERC20(LJStableCoinAddress).transfer(msg.sender, tokensBought);
    }
     /**
    @dev Swaps LJStableCoin Tokens for Matic
    */
    function ljStableCoinTokenToMatic(uint _tokensSold, uint _minMatic) external {
   uint256 ljstableCoinReserve = getLJStableReserve();
        uint256 maticBought = getAmountOfTokens(
            _tokensSold,
            ljstableCoinReserve,
            address(this).balance
        );
        require(maticBought >= _minMatic, "INSUFFICIENT_AMOUNT");
        IERC20(LJStableCoinAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(maticBought);
    }
   
    function getMaticBalance() external view returns(uint) {
        return userMaticBalance[msg.sender];
    }

     function getLJStableBalance() external view returns(uint) {
        return ljstableBalance[msg.sender];
    }
}