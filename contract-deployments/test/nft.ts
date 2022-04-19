import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);


describe("NFT", async function() {
    it("Should be able to mint an NFT and get the uri", async function() {
         const [owner, addr1, addr2] = await ethers.getSigners();
         const NFT = await ethers.getContractFactory("NFT");
         const nft = await  NFT.deploy();
         await nft.deployed();
         await nft.connect(addr1).mintToken({value: ethers.utils.parseEther('1')});
        const metadata = await nft.uri(1)
         console.log(`\nURL: ${metadata}\n`);
    })
})