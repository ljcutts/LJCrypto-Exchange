import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);



describe("LJCryptoToken", async function() {
     xit("Should be able to buy a token", async function () {
       const [owner, addr1, addr2] = await ethers.getSigners();
       const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
       const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
       await ljcryptoToken.deployed();
       await ljcryptoToken.connect(addr1).buyTokens(1, { value: ethers.utils.parseEther("1") });
       const tokenPrice = await ljcryptoToken.currentPricePerToken();
       await ljcryptoToken.connect(addr2).buyTokens(1, { value: tokenPrice });
       const tokenCost = await ljcryptoToken.currentPricePerToken();
       console.log(`\nToken Price: ${ethers.utils.formatEther(tokenCost)}\n`);
     });

     it("Should be able to sell a token", async function () {
       const [owner, addr1, addr2] = await ethers.getSigners();
       const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
       const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
       await ljcryptoToken.deployed();
       await ljcryptoToken.connect(addr1).buyTokens(1, { value: ethers.utils.parseEther("1") });
       await ljcryptoToken.connect(addr1).sellTokens(1);
      const tokenPrice = await ljcryptoToken.currentPricePerToken();
      console.log(tokenPrice)
     })

      xit("Should be able to stake tokens", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
        const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
        await ljcryptoToken.deployed();
        await ljcryptoToken.connect(addr1).buyTokens(2, { value: ethers.utils.parseEther("1") });
        await ljcryptoToken.connect(addr1).stakeTokens(2);
        const stakingBalance = await ljcryptoToken.stakingBalance(
           "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
         );
         console.log(`\nStaking Balance: ${stakingBalance}\n`);
         await network.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
         await network.provider.send("evm_mine");
        await ljcryptoToken.connect(addr1).stakedBalance();
        const newStakingBalance = await ljcryptoToken.stakingBalance(
          "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
        );
        const totalSupply =  await ljcryptoToken.totalSupply();
         console.log(`\nNew Staking Balance: ${newStakingBalance}\n`);
         console.log(`\nNew Total Supply: ${ethers.utils.formatEther(totalSupply)}\n`);
      });

      xit("Should be able to unstake tokens", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
        const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
        await ljcryptoToken.deployed();
         await ljcryptoToken.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1") });
         await ljcryptoToken.connect(addr1).stakeTokens(5);
         await network.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);
         await network.provider.send("evm_mine");
          const stakingBalance = await ljcryptoToken.stakingBalance(
            "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
          );
           console.log(`\n Staking Balance: ${stakingBalance}\n`);
        await ljcryptoToken.connect(addr1).unstakeTokens(6);
        const StakingBalance = await ljcryptoToken.stakingBalance(
          "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
        );
        expect(StakingBalance).to.equal(0);
         const totalSupply = await ljcryptoToken.totalSupply();
         console.log(`\nNew Total Supply: ${ethers.utils.formatEther(totalSupply)}\n`);
      });
})


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}