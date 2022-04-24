import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const pressAnyKey = require("press-any-key");


describe("LJCryptoDAO", async function() {
    xit("Should be able to get power from NFT", async function() {
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
          await nft.connect(addr1).setApprovalForAll(dao.address, true);
         await dao.connect(addr1).receivePowerThroughNFT(1);
         const nftDaoBalance = await nft.balanceOf(dao.address, 1)
         console.log("NFTDAOBALANCE", nftDaoBalance)
         const balance = await dao.connect(addr1).powerBalance();
         console.log(balance);
    })

    xit("Should be able to get power from Token", async function() {
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
        await token.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1") });
        await token.connect(addr1).approve(dao.address, 5);
        await dao.connect(addr1).receivePowerThroughToken(5);
        const balance = await dao.connect(addr1).powerBalance();
        console.log(balance);
    })

    it("Should be able to create, vote, and execute on proposal", async function() {
       const [owner, addr1, addr2, addr3] = await ethers.getSigners();
       const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
       const nft = await NFT.deploy();
       await nft.deployed();
       const Token = await ethers.getContractFactory("LJCryptoToken");
       const token = await Token.deploy();
       await token.deployed();
       const DAO = await ethers.getContractFactory("LJCryptoDAO");
       const dao = await DAO.deploy(nft.address, token.address);
       await dao.deployed();
       await token.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1") });
       await token.connect(addr1).approve(dao.address, 5);
       await dao.connect(addr1).receivePowerThroughToken(5);
       await dao.connect(addr1).createProposal()
        await nft.connect(addr2).mintToken({ value: ethers.utils.parseEther("1") });
        await nft.connect(addr2).setApprovalForAll(dao.address, true);
        await dao.connect(addr2).receivePowerThroughNFT(1);
       const balance = await dao.connect(addr1).powerBalance();
       expect(balance).to.equal(4);
       await dao.connect(addr2).voteOnProposal(0,1);
       const powerAmountNotEmpty = await dao.powerAmountNotEmpty(addr2.address)
       expect(powerAmountNotEmpty).to.equal(false);
        await network.provider.send("evm_increaseTime", [31536000]);
        await network.provider.send("evm_mine");
        await dao.connect(addr1).executeProposal(0);
        const proposalYes = (await dao.proposals(0)).proposalApproved;
        const proposalExecuted = (await dao.proposals(0)).executed
        expect(proposalYes).to.equal(true)
        expect(proposalExecuted).to.equal(true)
        // await token.connect(addr3).buyTokens(5, { value: ethers.utils.parseEther("1") });
        // await token.connect(addr3).approve(dao.address, 5);
        // await dao.connect(addr3).receivePowerThroughToken(5);
        // await dao.connect(addr3).voteOnProposal(0,1);
    })

    it("Should be able to withdraw nfts and tokens", async function() {
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
        const nft = await NFT.deploy();
        await nft.deployed();
        const Token = await ethers.getContractFactory("LJCryptoToken");
        const token = await Token.deploy();
        await token.deployed();
        const DAO = await ethers.getContractFactory("LJCryptoDAO");
        const dao = await DAO.connect(owner).deploy(nft.address, token.address);
        await dao.deployed();
        await token.connect(addr1).buyTokens(5, { value: ethers.utils.parseEther("1") });
        await token.connect(addr1).approve(dao.address, 5);
        await dao.connect(addr1).receivePowerThroughToken(5);
        const daoTokenBalance = await token.balanceOf(dao.address);
        expect(daoTokenBalance).to.equal(5)
        await dao.connect(addr1).createProposal();
        await nft.connect(addr2).mintToken({ value: ethers.utils.parseEther("1") });
        await nft.connect(addr2).setApprovalForAll(dao.address, true);
        await dao.connect(addr2).receivePowerThroughNFT(1);
        const nftDaoBalance = await nft.balanceOf(dao.address, 1);
        expect(nftDaoBalance).to.equal(1)
        await dao.connect(owner).withdrawTokens(5);
        await dao.connect(owner).withdrawNFTs(1,1);
    })
})