import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber } from "ethers";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);



describe("LJCryptoToken", async function() {
     it("Should be able to buy a token", async function () {
       const [owner, addr1, addr2] = await ethers.getSigners();
       const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
       const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
       await ljcryptoToken.deployed();
       await ljcryptoToken
         .connect(addr1)
         .buyTokens(ethers.utils.parseEther("1"), {
           value: ethers.utils.parseEther("1"),
         });
       const tokenPrice = await ljcryptoToken.currentPricePerToken();
         const balanceAmount = await ljcryptoToken
           .connect(addr1)
           .userBalancePrice();
         expect(balanceAmount).to.be.equal(1 * tokenPrice.toNumber());
       await ljcryptoToken
         .connect(addr2)
         .buyTokens(ethers.utils.parseEther("1"), { value: tokenPrice });
       const tokenCost = await ljcryptoToken.currentPricePerToken();
       expect(tokenCost).to.be.gt(BigNumber.from(0))
       const balanceOf = await ljcryptoToken.balanceOf(addr1.address)
       const balanceOf2 = await ljcryptoToken.balanceOf(addr2.address);
       expect(balanceOf).to.be.equal(ethers.utils.parseEther(`1`))
       expect(balanceOf2).to.be.equal(ethers.utils.parseEther(`1`));
     });

     it("Should be able to sell a token", async function () {
       const [owner, addr1, addr2] = await ethers.getSigners();
       const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
       const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
       await ljcryptoToken.deployed();
       await ljcryptoToken.connect(addr1).buyTokens(1, { value: ethers.utils.parseEther("1") });
       await ljcryptoToken.connect(addr1).sellTokens(1);
       const balanceOf = await ljcryptoToken.balanceOf(addr1.address);
       expect(balanceOf).to.be.equal(BigNumber.from(0));
     })

      it("Should be able to stake tokens", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
        const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
        await ljcryptoToken.deployed();
        await ljcryptoToken
          .connect(addr1)
          .buyTokens(ethers.utils.parseEther(`2`), {
            value: ethers.utils.parseEther("1"),
          });
        await ljcryptoToken
          .connect(addr1)
          .stakeTokens(ethers.utils.parseEther(`2`));
           const tokenCost = await ljcryptoToken.currentPricePerToken();
          const stakingAmount = await ljcryptoToken
            .connect(addr1)
            .stakingBalancePrice();
            expect(stakingAmount).to.be.equal(2*tokenCost.toNumber())
        const stakingBalance = await ljcryptoToken.stakingBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
        expect(stakingBalance).to.equal(ethers.utils.parseEther(`2`));
        await network.provider.send("evm_increaseTime", [31536000]);
        await network.provider.send("evm_mine");
        await ljcryptoToken.connect(addr1).stakedBalance();
        const newStakingBalance = await ljcryptoToken.stakingBalance("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
        const totalSupply =  await ljcryptoToken.totalSupply();
       expect(newStakingBalance).to.gt(ethers.utils.parseEther(`4`));
        expect(totalSupply).to.gt(100002);
      });

      it("Should be able to unstake tokens", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
        const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
        await ljcryptoToken.deployed();
         await ljcryptoToken
           .connect(addr1)
           .buyTokens(ethers.utils.parseEther(`5`), {
             value: ethers.utils.parseEther("1"),
           });
         await ljcryptoToken
           .connect(addr1)
           .stakeTokens(ethers.utils.parseEther(`5`));
         await network.provider.send("evm_increaseTime", [31536000]);
         await network.provider.send("evm_mine");
        await ljcryptoToken
          .connect(addr1)
          .unstakeTokens(ethers.utils.parseEther(`10`));
        const StakingBalance = await ljcryptoToken.stakingBalance(
          "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
        );
        expect(StakingBalance).to.be.lt(ethers.utils.parseEther(`1`));
         const totalSupply = await ljcryptoToken.totalSupply();
         expect(totalSupply).to.gt(100005);
      });
})
