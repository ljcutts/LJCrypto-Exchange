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

  xit("Should be able to remove liquidity", async function() {
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

  xit("Should be able to swap LJCrypto to LJStable", async function () {
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
     await ljcryptoToken.connect(addr1).buyTokens(100, { value: ethers.utils.parseEther("1000") });
     const ljcryptoTokenPrice = await ljcryptoToken.currentPricePerTokenInEther();
     console.log(ethers.utils.formatEther(ljcryptoTokenPrice));
     await ljstablecoin.connect(addr1).buyTokens(3000, { value: ethers.utils.parseEther("12") });
     await ljcryptoToken.connect(addr1).approve(liquidityAndswapping.address.toString(), 100);
     await ljstablecoin.connect(addr1).approve(liquidityAndswapping.address.toString(), 1500);
     await liquidityAndswapping.connect(addr1).addLiquidityForERC20Pair(100, 1500);
     await ljcryptoToken.connect(addr2).buyTokens(100, { value: ethers.utils.parseEther("1000") });
     await ljcryptoToken.connect(addr2).approve(liquidityAndswapping.address.toString(), 100);
     const userBalance = await ljstablecoin.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\nLJStableBalance: ${userBalance}\n`);
     const ljcryptoBalance = await ljcryptoToken.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\n LJCryptoBalance: ${ljcryptoBalance}\n`);
     await liquidityAndswapping.connect(addr2).ljcryptoTokenToLJStableToken(1,14);
     const newuserBalance = await ljstablecoin.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\n New LJStableBalance: ${newuserBalance}\n`);
     const newljcryptoBalance = await ljcryptoToken.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\n New LJCryptoBalance: ${newljcryptoBalance}\n`);
  })

  it("Should be able to swap LJStable to LJCrypto", async function() {
     const [owner, addr1, addr2] = await ethers.getSigners();
     const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
     const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
     await ljcryptoToken.deployed();
     const ljcryptoTokenAddress = ljcryptoToken.address.toString();
     const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
     const ljstablecoin = await LJStableCoin.connect(owner).deploy();
     await ljstablecoin.deployed();
     const ljstablecoinAddress = ljstablecoin.address.toString();
     const LiquidityAndSwapping = await ethers.getContractFactory("LiquidityAndSwapping");
     const liquidityAndswapping = await LiquidityAndSwapping.connect(owner).deploy(ljcryptoTokenAddress, ljstablecoinAddress);
     await liquidityAndswapping.deployed();
     await ljcryptoToken.connect(addr1).buyTokens(5000, { value: ethers.utils.parseEther("1000")});
     const ljcryptoTokenPrice = await ljcryptoToken.currentPricePerTokenInEther();
     console.log(ethers.utils.formatEther(ljcryptoTokenPrice));
     await ljstablecoin.connect(addr1).buyTokens(3000, { value: ethers.utils.parseEther("12")});
     await ljcryptoToken.connect(addr1).approve(liquidityAndswapping.address.toString(), 5000);
     await ljstablecoin.connect(addr1).approve(liquidityAndswapping.address.toString(), 1500);
     await liquidityAndswapping.connect(addr1).addLiquidityForERC20Pair(5000, 1500);
     await ljstablecoin.connect(addr2).buyTokens(3000, { value: ethers.utils.parseEther("12")});
     await ljstablecoin.connect(addr2).approve(liquidityAndswapping.address.toString(), 3000);
     const ljstableBalance = await ljstablecoin.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\n LJStableBalance: ${ljstableBalance}\n`);
     const ljcryptoBalance = await ljcryptoToken.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\n LJCryptoBalance: ${ljcryptoBalance}\n`);
     await liquidityAndswapping.connect(addr2).ljstableTokenToLJCryptoToken(10, 32)
     const newljstableBalance = await ljstablecoin.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\n New LJStableBalance: ${newljstableBalance}\n`);
     const newljcryptoBalance = await ljcryptoToken.balanceOf("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc");
     console.log(`\n New LJCryptoBalance: ${newljcryptoBalance}\n`);
  })
})