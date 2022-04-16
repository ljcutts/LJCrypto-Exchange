// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ILJCrypto {
    function currentPricePerTokenInEther() external view returns(uint);
}


contract LiquidityAndSwapping is ERC20 {
    address public LJCryptoTokenAddress;
    address public LJStableCoinAddress;
   constructor(address _LJCryptoTokenAddress, address _LJStableCoinAddress) ERC20("LJCrypto LP Token", "LJLP") {
    require(_LJCryptoTokenAddress != address(0) && _LJStableCoinAddress != address(0), "Token address passed is a null address");
       LJCryptoTokenAddress = _LJCryptoTokenAddress;
       LJStableCoinAddress = _LJStableCoinAddress;
    }


function getLJCrytpoReserve() public view returns(uint) {
    return IERC20(LJCryptoTokenAddress).balanceOf(address(this));
}

function getLJStableReserve() public view returns(uint) {
    return IERC20(LJStableCoinAddress).balanceOf(address(this));
}

function currentPriceOfLJCryptoToken() public view returns(uint) {
    return ILJCrypto(LJCryptoTokenAddress).currentPricePerTokenInEther();
}


  function addLiquidityForERC20Pair(uint _amountA, uint _amountB) public returns(uint) {
    uint LJCryptoAmount = _amountA * currentPriceOfLJCryptoToken();
    uint LJStableCoinAmount = _amountB * 0.0004 ether;
    require(LJCryptoAmount >= LJStableCoinAmount || LJStableCoinAmount >= LJCryptoAmount, "The amounts you added aren't balanced");
    uint liquidity;
    uint LJCryptoTokenReserve = getLJCrytpoReserve();
    uint LJCryptoStableReserve = getLJStableReserve();
    IERC20 LJCryptoToken = IERC20(LJCryptoTokenAddress);
    IERC20 LJStableCoin = IERC20(LJStableCoinAddress);
    if(LJCryptoTokenReserve == 0 && LJCryptoStableReserve == 0) {
       LJCryptoToken.transferFrom(msg.sender, address(this), _amountA);
       LJStableCoin.transferFrom(msg.sender, address(this), _amountB);
       liquidity = _amountA + _amountB;
       _mint(msg.sender, liquidity);
    } else {
        uint LJCryptoTokenAmount = (_amountB * LJCryptoTokenReserve)/(LJCryptoStableReserve);
        uint LJStableAmount = (_amountA * LJCryptoStableReserve)/(LJCryptoTokenReserve);
        require(_amountA >= LJCryptoTokenAmount, "Amount of tokens sent is less than the minimum tokens required");
        require(_amountB >= LJStableAmount, "Amount of tokens sent is less than the minimum tokens required");
        LJCryptoToken.transferFrom(msg.sender, address(this), LJCryptoTokenAmount);
        LJStableCoin.transferFrom(msg.sender, address(this), LJStableAmount);
        liquidity = (totalSupply() * (_amountA + _amountB))/ (LJCryptoStableReserve + LJCryptoTokenReserve);
        _mint(msg.sender, liquidity);
    }
    return liquidity;
}


function removeLiquidityForERC20Pair(uint _amountA, uint _amountB) public returns(uint, uint) {
    require(_amountA > 0 && _amountB > 0, '_amountA and B should be greater than zero');
    uint LJCryptoAmount = _amountA * currentPriceOfLJCryptoToken();
    uint LJStableCoinAmount = _amountB * 0.0004 ether;
    require(LJCryptoAmount >= LJStableCoinAmount || LJStableCoinAmount >= LJCryptoAmount, "The amounts you added aren't balanced");
    uint LJCryptoTokenReserve = getLJCrytpoReserve();
    uint LJCryptoStableReserve = getLJStableReserve();
    uint _totalSupply = totalSupply();
    uint LJCryptoTokenAmount = (LJCryptoTokenReserve * _amountA)/ _totalSupply;
    uint LJStableAmount = (LJCryptoStableReserve * _amountB)/ _totalSupply;
    IERC20 LJCryptoToken = IERC20(LJCryptoTokenAddress);
    IERC20 LJStableCoin = IERC20(LJStableCoinAddress);
    _burn(msg.sender, (_amountA + _amountB));
    LJCryptoToken.transfer(msg.sender, LJCryptoTokenAmount);
    LJStableCoin.transfer(msg.sender, LJStableAmount);
    return (LJCryptoTokenAmount,  LJStableAmount);
}

function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

      /**
     @dev Swaps LJCrypto for LJStable
    */
    function ljcryptoTokenToLJStableToken(uint _tokensSold, uint _minljStable) public {
    uint256 ljstableTokenReserve = getLJStableReserve();
    uint256 ljcryptoTokenReserve = getLJCrytpoReserve();
    uint256 tokensBought = getAmountOfTokens(
        _tokensSold,
        ljcryptoTokenReserve,
        ljstableTokenReserve
    );

    require(tokensBought >= _minljStable, "insufficient output amount");
    IERC20(LJCryptoTokenAddress).transferFrom(msg.sender, address(this), _tokensSold);
    IERC20(LJStableCoinAddress).transfer(msg.sender, tokensBought);
    }
     /**
    @dev Swaps LJStable for LJCrypto
    */
    function ljstableTokenToLJCryptoToken(uint _tokensSold, uint _minljCrypto) public {
        uint256 ljstableTokenReserve = getLJStableReserve();
        uint256 ljcryptoTokenReserve = getLJCrytpoReserve();
        uint256 tokensBought = getAmountOfTokens(
            _tokensSold,
            ljstableTokenReserve,
            ljcryptoTokenReserve
        );
        require(tokensBought >= _minljCrypto, "insufficient output amount");
        IERC20(LJStableCoinAddress).transferFrom(msg.sender, address(this), _tokensSold);
        IERC20(LJCryptoTokenAddress).transfer(msg.sender, tokensBought);
    }
}