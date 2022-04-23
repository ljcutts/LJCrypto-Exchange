import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const pressAnyKey = require("press-any-key");


describe("NFT", async function() {
    it("Should be able to mint an NFT and get the uri", async function() {
         const [owner, addr1, addr2] = await ethers.getSigners();
         const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
         const nft = await  NFT.deploy();
         await nft.deployed();
        //  console.log(`Please fund ${nft.address} with LINK`);
        //  await pressAnyKey();
         await nft.connect(addr1).mintToken({value: ethers.utils.parseEther('1')});
          await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
           await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
            await network.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);
            await network.provider.send("evm_mine");
            await nft.connect(addr1).stakedBalance()
            const stakingBalance = await nft.connect(addr1).checkStakingBalance();
         const balance = await nft.connect(addr1).totalNFTBalance();
         console.log(balance)
         console.log(`\nStaking Balance: ${stakingBalance}\n`);
        // const metadata = await nft.uri(1)
        //  console.log(`\nURL: ${metadata}\n`);

    })
})