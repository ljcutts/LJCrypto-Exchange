import { expect } from "chai";
import { ethers } from "hardhat";
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
         .buyTokens(5, { value: ethers.utils.parseEther("1") });
       const tokenBalance = await ljcryptoToken.tokenBalance(
         "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
       );
       await ljcryptoToken
         .connect(addr2)
         .buyTokens(5, { value: ethers.utils.parseEther("0.00006") });
       const contractBalance = await ljcryptoToken.balanceOfContract();
       const tokenCost = await ljcryptoToken.currentPricePerToken();
       expect(tokenBalance).to.equal(5);
       console.log(
         `\nContract Balance: ${ethers.utils.formatEther(contractBalance)}\n`
       );
       console.log(`\nToken Price: ${ethers.utils.formatEther(tokenCost)}\n`);
     });

     xit("Should be able to sell a token", async function () {
       const [owner, addr1, addr2] = await ethers.getSigners();
       const LJCryptoToken = await ethers.getContractFactory("LJCryptoToken");
       const ljcryptoToken = await LJCryptoToken.connect(owner).deploy();
       await ljcryptoToken.deployed();
       await ljcryptoToken.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1") });
       const userBalance = await ljcryptoToken.connect(addr1).receiveBalance();
       console.log( `\nUser Balance: ${ethers.utils.formatEther(userBalance)}\n`);
         await ljcryptoToken
           .connect(addr1)
           .sellTokens(5);
            const newBalance = await ljcryptoToken
              .connect(addr1)
              .receiveBalance();
            console.log(
              `\nNew Balance: ${ethers.utils.formatEther(newBalance)}\n`
            );
       const tokenBalance = await ljcryptoToken.tokenBalance(
         "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
       );
       expect(tokenBalance).to.equal(0);
       const contractBalance = await ljcryptoToken.balanceOfContract();
       const tokenCost = await ljcryptoToken.currentPricePerToken();
       
       console.log(
         `\nContract Balance: ${ethers.utils.formatEther(contractBalance)}\n`
       );
       console.log(`\nToken Price: ${ethers.utils.formatEther(tokenCost)}\n`);
     });
})