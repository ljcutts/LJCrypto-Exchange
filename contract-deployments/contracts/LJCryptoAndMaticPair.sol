// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

 interface ILJCrypto {
    function currentPricePerToken() external view returns(uint);
}

contract LJCryptoAndMaticPair is ERC20 {
   address public LJCryptoTokenAddress;
    constructor(address _LJCryptoTokenAddress) ERC20("LJC/Matic LP Token", "LJLP") {
    require(_LJCryptoTokenAddress != address(0), "NOT_AN_ADDRESS");
       LJCryptoTokenAddress = _LJCryptoTokenAddress;
    }
    
function getLJCryptoReserve() public view returns(uint) {
    return IERC20(LJCryptoTokenAddress).balanceOf(address(this));
}

function addLiquidity(uint _amount) external payable returns(uint) {
    uint liquidity;
    uint ethBalance = address(this).balance;
     uint LJCryptoTokenReserve = getLJCryptoReserve();
     IERC20 LJCryptoToken = IERC20(LJCryptoTokenAddress);

    if(LJCryptoTokenReserve == 0) {
       LJCryptoToken.transferFrom(msg.sender, address(this), _amount);
        liquidity = ethBalance;
        _mint(msg.sender, liquidity);
    } else {
        uint ethReserve = ethBalance - msg.value;
        uint ljcryptoTokenAmount = (msg.value * LJCryptoTokenReserve)/(ethReserve);
         require(_amount >= ljcryptoTokenAmount, "INSUFFICIENT_AMOUNT");
         LJCryptoToken.transferFrom(msg.sender, address(this), ljcryptoTokenAmount);
        liquidity = (totalSupply() * msg.value)/ ethReserve;
        _mint(msg.sender, liquidity);
    }
    return liquidity;
}

function removeLiquidity(uint _amount) external returns(uint, uint) {
    require(_amount > 0, 'CANT_BE_ZERO');
    uint ethReserve = address(this).balance;
    uint _totalSupply = totalSupply();
    uint ethAmount = (ethReserve * _amount)/ _totalSupply;
    uint ljcryptoTokenAmount = (getLJCryptoReserve() * _amount)/ _totalSupply;
    _burn(msg.sender, _amount);
    payable(msg.sender).transfer(ethAmount);
    IERC20(LJCryptoTokenAddress).transfer(msg.sender, ljcryptoTokenAmount);
    return (ethAmount, ljcryptoTokenAmount);
}

  /**
    @dev Returns the amount Eth/Crypto Dev tokens that would be returned to the user
    * in the swap
    */
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
     @dev Swaps Ether for CryptoDev Tokens
    */
    function ethToCryptoDevToken(uint _minTokens) external payable {
   uint256 ljcryptoTokenReserve = getLJCryptoReserve();
    uint256 tokensBought = getAmountOfTokens(
        msg.value,
        address(this).balance - msg.value,
        ljcryptoTokenReserve
    );

    require(tokensBought >= _minTokens, "INSUFFICIENT_AMOUNT");
    IERC20(LJCryptoTokenAddress).transfer(msg.sender, tokensBought);
    }
     /**
    @dev Swaps CryptoDev Tokens for Ether
    */
    function cryptoDevTokenToEth(uint _tokensSold, uint _minEth) external {
   uint256 ljcryptoTokenReserve = getLJCryptoReserve();
        uint256 ethBought = getAmountOfTokens(
            _tokensSold,
            ljcryptoTokenReserve,
            address(this).balance
        );
        require(ethBought >= _minEth, "INSUFFICIENT_AMOUNT");
        IERC20(LJCryptoTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(ethBought);
    }
}