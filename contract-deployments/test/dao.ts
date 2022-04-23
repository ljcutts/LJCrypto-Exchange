import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const pressAnyKey = require("press-any-key");


describe("LJCryptoDAO", async function() {
    it("Should be able to get power from NFT", async function() {
         const [owner, addr1, addr2] = await ethers.getSigners();
          const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
          const nft = await NFT.deploy();
          await nft.deployed();
           const Token = await ethers.getContractFactory("LJCryptoToken");
           const token = await Token.deploy();
           await token.deployed();
         const DAO = await ethers.getContractFactory("LJCryptoDAO");
         const dao = await DAO.deploy(nft.address, token.address);
         await dao.deployed();
         await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
         await dao.connect(addr1).receivePowerThroughNFT(8);
         const balance = await dao.connect(addr1).powerBalance();
         console.log(balance);
    })
})