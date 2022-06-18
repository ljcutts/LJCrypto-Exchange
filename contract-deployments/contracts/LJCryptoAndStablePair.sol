// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ILJCrypto {
    function currentPricePerToken() external view returns(uint);
}

//need to update token contracts espcially the staking
contract LJCryptoAndStablePair is ERC20 {
    address public LJCryptoTokenAddress;
    address public LJStableCoinAddress;
    mapping(address => uint) ljcryptoBalance;
    mapping(address => uint) ljstableBalance;
   constructor(address _LJCryptoTokenAddress, address _LJStableCoinAddress) ERC20("LJC/LJS LP Token", "LJLP") {
    require(_LJCryptoTokenAddress != address(0) && _LJStableCoinAddress != address(0), "NOT_AN_ADDRESS");
       LJCryptoTokenAddress = _LJCryptoTokenAddress;
       LJStableCoinAddress = _LJStableCoinAddress;
    }
function getLJCryptoReserve() public view returns(uint) {
    return IERC20(LJCryptoTokenAddress).balanceOf(address(this));
}

function getLJStableReserve() public view returns(uint) {
    return IERC20(LJStableCoinAddress).balanceOf(address(this));
}

function currentPriceOfLJCryptoToken() public view returns(uint) {
    return ILJCrypto(LJCryptoTokenAddress).currentPricePerToken();
}


  function addLiquidity(uint _amountA, uint _amountB) external returns(uint) {
    uint LJCryptoAmount = _amountA * currentPriceOfLJCryptoToken();
    uint LJStableCoinAmount = _amountB * 0.0004 ether;
    require(LJCryptoAmount >= LJStableCoinAmount || LJStableCoinAmount >= LJCryptoAmount, "AMOUNTS_NOT_BALANCED");
    uint liquidity;
    uint LJCryptoTokenReserve = getLJCryptoReserve();
    uint LJCryptoStableReserve = getLJStableReserve();
    IERC20 LJCryptoToken = IERC20(LJCryptoTokenAddress);
    IERC20 LJStableCoin = IERC20(LJStableCoinAddress);
    if(LJCryptoTokenReserve == 0 && LJCryptoStableReserve == 0) {
      ljcryptoBalance[msg.sender] += _amountA;
       ljstableBalance[msg.sender] += _amountB;
       LJCryptoToken.transferFrom(msg.sender, address(this), _amountA);
       LJStableCoin.transferFrom(msg.sender, address(this), _amountB);
       liquidity = _amountA + _amountB;
       _mint(msg.sender, liquidity);
    } else {
        uint LJCryptoTokenAmount = (_amountB * LJCryptoTokenReserve)/(LJCryptoStableReserve);
        uint LJStableAmount = (_amountA * LJCryptoStableReserve)/(LJCryptoTokenReserve);
        require(_amountA >= LJCryptoTokenAmount, "INSUFFICIENT_AMOUNT");
        require(_amountB >= LJStableAmount, "INSUFFICIENT_AMOUNT");
        ljcryptoBalance[msg.sender] += _amountA;
        ljstableBalance[msg.sender] += _amountB;
        LJCryptoToken.transferFrom(msg.sender, address(this), LJCryptoTokenAmount);
        LJStableCoin.transferFrom(msg.sender, address(this), LJStableAmount);
        liquidity = (totalSupply() * (_amountA + _amountB))/ (LJCryptoStableReserve + LJCryptoTokenReserve);
        _mint(msg.sender, liquidity);
    }
    return liquidity;
}


function removeLiquidity(uint _amountA, uint _amountB) external returns(uint, uint) {
    require(_amountA > 0 && _amountB > 0, 'CANT_BE_ZERO');
    uint LJCryptoAmount = _amountA * currentPriceOfLJCryptoToken();
    uint LJStableCoinAmount = _amountB * 0.0004 ether;
    require(LJCryptoAmount >= LJStableCoinAmount || LJStableCoinAmount >= LJCryptoAmount, "NOT_BALANCED");
    uint LJCryptoTokenReserve = getLJCryptoReserve();
    uint LJCryptoStableReserve = getLJStableReserve();
    uint _totalSupply = totalSupply();
    uint LJCryptoTokenAmount = (LJCryptoTokenReserve * (_amountA/1e18))/ _totalSupply;
    uint LJStableAmount = (LJCryptoStableReserve * (_amountB/1e18))/ _totalSupply;
    IERC20 LJCryptoToken = IERC20(LJCryptoTokenAddress);
    IERC20 LJStableCoin = IERC20(LJStableCoinAddress);
    ljcryptoBalance[msg.sender] -= LJCryptoTokenAmount;
    ljstableBalance[msg.sender] -= LJStableAmount;
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
        require(inputReserve > 0 && outputReserve > 0, "INVALID_RESERVES");
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }
    
      /**
     @dev Swaps LJCrypto for LJStable
    */
    function ljcryptoTokenToLJStableToken(uint _tokensSold, uint _minljStable) external {
    uint256 ljstableTokenReserve = getLJStableReserve();
    uint256 ljcryptoTokenReserve = getLJCryptoReserve();
    uint256 tokensBought = getAmountOfTokens(
        _tokensSold,
        ljcryptoTokenReserve,
        ljstableTokenReserve
    );
    require(tokensBought >= _minljStable, "INSUFFICIENT_AMOUNT");
    IERC20(LJCryptoTokenAddress).transferFrom(msg.sender, address(this), _tokensSold);
    IERC20(LJStableCoinAddress).transfer(msg.sender, tokensBought);
    }
     /**
    @dev Swaps LJStable for LJCrypto
    */
    function ljstableTokenToLJCryptoToken(uint _tokensSold, uint _minljCrypto) external {
        uint256 ljstableTokenReserve = getLJStableReserve();
        uint256 ljcryptoTokenReserve = getLJCryptoReserve();
        uint256 tokensBought = getAmountOfTokens(
            _tokensSold,
            ljstableTokenReserve,
            ljcryptoTokenReserve
        );
        require(tokensBought >= _minljCrypto, "INSUFFICIENT_AMOUNT");
        IERC20(LJStableCoinAddress).transferFrom(msg.sender, address(this), _tokensSold);
        IERC20(LJCryptoTokenAddress).transfer(msg.sender, tokensBought);
    }

    function getLJCryptoBalance() external view returns(uint) {
        return ljcryptoBalance[msg.sender];
    }

     function getLJStableBalance() external view returns(uint) {
        return ljstableBalance[msg.sender];
    }
}