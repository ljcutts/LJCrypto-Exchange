import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);


describe("LiquidityAndSwapping", async function () {
  xit("Should be able to add liquidity", async function(){
     const [owner, addr1, addr2] = await ethers.getSigners();
      const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
      const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
      await ljcryptoToken.deployed();
      const ljcryptoTokenAddress = ljcryptoToken.address.toString()
      const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
      const ljstablecoin = await LJStableCoin.connect(owner).deploy();
      await ljstablecoin.deployed();
      const ljstablecoinAddress = ljstablecoin.address.toString()
     const LiquidityAndSwapping = await ethers.getContractFactory("LiquidityAndSwapping");
     const liquidityAndswapping = await LiquidityAndSwapping.connect(owner).deploy(ljcryptoTokenAddress,ljstablecoinAddress );
     await liquidityAndswapping.deployed();
     await ljcryptoToken.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1") });
     const ljcryptoTokenPrice = await ljcryptoToken.currentPricePerTokenInEther()
     console.log(ethers.utils.formatEther(ljcryptoTokenPrice))
     await ljstablecoin.connect(addr1).buyTokens(3000, { value: ethers.utils.parseEther("12") });
     await ljcryptoToken.connect(addr1).approve(liquidityAndswapping.address.toString(), 5)
     await ljstablecoin.connect(addr1).approve(liquidityAndswapping.address.toString(), 100);
     await liquidityAndswapping.connect(addr1).addLiquidityForERC20Pair(4, 100);
     const mintStatus = await liquidityAndswapping.totalSupply();
     console.log(mintStatus)
     await ljcryptoToken.connect(addr2).buyTokens(5, { value: ethers.utils.parseEther("1") });
     await ljstablecoin.connect(addr2).buyTokens(3000, { value: ethers.utils.parseEther("12") });
     await ljcryptoToken.connect(addr2).approve(liquidityAndswapping.address.toString(), 5);
     await ljstablecoin.connect(addr2).approve(liquidityAndswapping.address.toString(), 100);
     await liquidityAndswapping.connect(addr2).addLiquidityForERC20Pair(4, 100);
      const newmintStatus = await liquidityAndswapping.totalSupply();
      console.log(newmintStatus);
      const ljcryptoTokenBalance =
        await liquidityAndswapping.getLJCrytpoReserve();
      const ljstablenBalance = await liquidityAndswapping.getLJStableReserve();
     console.log(`ljcryptoReserver: ${ljcryptoTokenBalance}`)
      console.log(`ljstableReserver: ${ljstablenBalance}`);
  })

  it("Should be able to remove liquidity", async function() {
     const [owner, addr1, addr2] = await ethers.getSigners();
     const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
     const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
     await ljcryptoToken.deployed();
     const ljcryptoTokenAddress = ljcryptoToken.address.toString();
     const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
     const ljstablecoin = await LJStableCoin.connect(owner).deploy();
     await ljstablecoin.deployed();
     const ljstablecoinAddress = ljstablecoin.address.toString();
     const LiquidityAndSwapping = await ethers.getContractFactory(
       "LiquidityAndSwapping"
     );
     const liquidityAndswapping = await LiquidityAndSwapping.connect(owner).deploy(ljcryptoTokenAddress, ljstablecoinAddress);
     await liquidityAndswapping.deployed();
     await ljcryptoToken.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1") });
     const ljcryptoTokenPrice = await ljcryptoToken.currentPricePerTokenInEther();
     console.log(ethers.utils.formatEther(ljcryptoTokenPrice));
     await ljstablecoin.connect(addr1).buyTokens(3000, { value: ethers.utils.parseEther("12") });
     await ljcryptoToken.connect(addr1).approve(liquidityAndswapping.address.toString(), 5);
     await ljstablecoin.connect(addr1).approve(liquidityAndswapping.address.toString(), 100);
     await liquidityAndswapping.connect(addr1).addLiquidityForERC20Pair(4, 100);
     const mintStatus = await liquidityAndswapping.totalSupply();
     console.log(`\nTotal Supply: ${mintStatus}\n`);
     const ljcryptoTokenBalance = await liquidityAndswapping.getLJCrytpoReserve();
     const ljstablenBalance = await liquidityAndswapping.getLJStableReserve();
     const balanceOfUser = await ljstablecoin.balanceOf('0x70997970c51812dc3a010c7d01b50e0d17dc79c8')
     console.log(`\n LJCryptoReserve:${ljcryptoTokenBalance}\n`);
     console.log(`\n LJStableReserve:${ljstablenBalance}\n`);
      console.log(`\n UserBalance:${balanceOfUser}\n`);
      console.log(`\n ------------------------------------------\n`);
     await liquidityAndswapping.connect(addr1).removeLiquidityForERC20Pair(4, 100);
      const newmintStatus = await liquidityAndswapping.totalSupply();
      console.log(`\n New Total Supply: ${newmintStatus}\n`);
      const newljcryptoTokenBalance =
        await liquidityAndswapping.getLJCrytpoReserve();
      const newljstablenBalance = await liquidityAndswapping.getLJStableReserve();
      const newbalanceOfUser = await ljstablecoin.balanceOf(
        "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
      );
      console.log(`\n New  LJCrytpoReserve:${newljcryptoTokenBalance}\n`);
      console.log(`\n New LJStableReserve:${newljstablenBalance}\n`);
      console.log(`\n New User Balance: ${newbalanceOfUser}\n`);

  })
})