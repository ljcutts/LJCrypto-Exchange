import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);


describe("LJStablecoin", async function() {
    xit("Should be able to buy a token", async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
      const ljstablecoin = await LJStableCoin.connect(owner).deploy();
      await ljstablecoin.deployed();

      await ljstablecoin.connect(addr1).buyTokens(3000, {value: ethers.utils.parseEther('1')});
      await ljstablecoin
        .connect(addr2)
        .buyTokens(4000, { value: ethers.utils.parseEther("1") }); 
    });

     it("Should be able to stake a token", async function () {
       const [owner, addr1, addr2] = await ethers.getSigners();
       const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
       const ljstablecoin = await LJStableCoin.connect(owner).deploy();
       await ljstablecoin.deployed();
       await ljstablecoin.connect(addr1).buyTokens(3000, { value: ethers.utils.parseEther("1000") });
       await ljstablecoin.connect(addr1).stakeTokens(3000);
       const stakingBalance = await ljstablecoin.stakingBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
        console.log(`\nStaking Balance: ${stakingBalance}\n`);
        await network.provider.send("evm_increaseTime", [31536000]);
        await network.provider.send("evm_mine");
        await ljstablecoin.connect(addr1).stakedBalance();
         await network.provider.send("evm_increaseTime", [15768000]);
         await network.provider.send("evm_mine");
        await ljstablecoin.connect(addr1).stakedBalance();
        await ljstablecoin.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1000") });
         await ljstablecoin.connect(addr1).stakeTokens(5);
        const newStakingBalance = await ljstablecoin.stakingBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
        const totalSupply = await ljstablecoin.totalSupply();
        console.log(`\nNew Staking Balance: ${newStakingBalance}\n`);
        console.log(
          `\nNew Total Supply: ${ethers.utils.formatEther(totalSupply)}\n`
        );
     });
    //  it("Should be able to get price", async function () {
    //    const [owner, addr1, addr2] = await ethers.getSigners();
    //    const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
    //    const ljstablecoin = await LJStableCoin.connect(owner).deploy(
    //      "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    //    );
    //    await ljstablecoin.deployed();
       
       
    //  })
    
})