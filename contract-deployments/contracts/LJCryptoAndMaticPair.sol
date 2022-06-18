// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


 interface ILJCrypto {
    function currentPricePerToken() external view returns(uint);
}

contract LJCryptoAndMaticPair is ERC20 {
   address public LJCryptoTokenAddress;
   mapping(address => uint) ljcryptoBalance;
   mapping(address => uint) userMaticBalance;
    constructor(address _LJCryptoTokenAddress) ERC20("LJC/Matic LP Token", "LJLP") {
    require(_LJCryptoTokenAddress != address(0), "NOT_AN_ADDRESS");
       LJCryptoTokenAddress = _LJCryptoTokenAddress;
    }
    
function getLJCryptoReserve() public view returns(uint) {
    return IERC20(LJCryptoTokenAddress).balanceOf(address(this));
}

function currentPriceOfLJCryptoToken() public view returns(uint) {
    return ILJCrypto(LJCryptoTokenAddress).currentPricePerToken();
}

function addLiquidity(uint _amountA) external payable returns(uint) {
    require(_amountA > 0 && msg.value > 0, 'CANT_BE_ZERO');
    uint LJCryptoPrice = currentPriceOfLJCryptoToken();
    uint LJCryptoAmount = _amountA * LJCryptoPrice;
    uint MaticAmount = msg.value;
    require(LJCryptoAmount >= MaticAmount || MaticAmount >= LJCryptoAmount, "NOT_BALANCED");
    uint liquidity;
    uint maticBalance = address(this).balance;
    uint LJCryptoTokenReserve = getLJCryptoReserve();
    IERC20 LJCryptoToken = IERC20(LJCryptoTokenAddress);
    if(LJCryptoTokenReserve == 0) {
       userMaticBalance[msg.sender] += msg.value;
       ljcryptoBalance[msg.sender] += _amountA;
       LJCryptoToken.transferFrom(msg.sender, address(this), _amountA);
       liquidity = maticBalance;
       _mint(msg.sender, liquidity);
    } else {
        uint maticReserve = maticBalance - msg.value;
        uint ljcryptoTokenAmount = (msg.value * LJCryptoTokenReserve)/(maticReserve);
         require(_amountA >= ljcryptoTokenAmount, "INSUFFICIENT_AMOUNT");
         userMaticBalance[msg.sender] += msg.value;
         ljcryptoBalance[msg.sender] += _amountA;
         LJCryptoToken.transferFrom(msg.sender, address(this), ljcryptoTokenAmount);
        liquidity = (totalSupply() * msg.value)/ maticReserve;
        _mint(msg.sender, liquidity);
    }
    return liquidity;
}

function removeLiquidity(uint _amountA, uint _amountB) external returns(uint, uint) {
    require(_amountA > 0, 'CANT_BE_ZERO');
    uint LJCryptoPrice = currentPriceOfLJCryptoToken();
    uint LJCryptoAmount = _amountA * LJCryptoPrice;
    uint MaticAmount = _amountB;
    require(LJCryptoAmount >= MaticAmount || MaticAmount >= LJCryptoAmount, "NOT_BALANCED");
    uint maticReserve = address(this).balance;
    uint _totalSupply = totalSupply();
    uint maticAmount = (maticReserve * (_amountB/1e18))/ _totalSupply;
    uint ljcryptoTokenAmount = (getLJCryptoReserve() * (_amountA/1e18))/ _totalSupply;
    userMaticBalance[msg.sender] -=  maticAmount;
    ljcryptoBalance[msg.sender] -= ljcryptoTokenAmount;
    _burn(msg.sender, _amountA);
    payable(msg.sender).transfer(maticAmount);
    IERC20(LJCryptoTokenAddress).transfer(msg.sender, ljcryptoTokenAmount);
    return (maticAmount, ljcryptoTokenAmount);
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
     @dev Swaps Matic for LJCrypto Tokens
    */
    function maticToLJCryptoToken(uint _minTokens) external payable {
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
    @dev Swaps LJCrypto Tokens for Matic
    */
    function ljcryptoTokenToMatic(uint _tokensSold, uint _minMatic) external {
   uint256 ljcryptoTokenReserve = getLJCryptoReserve();
        uint256 maticBought = getAmountOfTokens(
            _tokensSold,
            ljcryptoTokenReserve,
            address(this).balance
        );
        require(maticBought >= _minMatic, "INSUFFICIENT_AMOUNT");
        IERC20(LJCryptoTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(maticBought);
    }

     function getMaticBalance() external view returns(uint) {
        return userMaticBalance[msg.sender];
    }

     function getLJCryptoBalance() external view returns(uint) {
        return ljcryptoBalance[msg.sender];
    }
}