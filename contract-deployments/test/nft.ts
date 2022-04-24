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
         const nft = await  NFT.connect(owner).deploy();
         await nft.deployed();
        //  console.log(`Please fund ${nft.address} with LINK`);
        //  await pressAnyKey();
         await nft.connect(addr1).mintToken({value: ethers.utils.parseEther('1')});
         await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
         await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
         await nft.connect(owner).withdraw();
        const balance = await nft.connect(owner).balance();
        console.log(ethers.utils.formatEther(balance));
        const metadata = await nft.uri(0)
         console.log(`\nURL: ${metadata}\n`);
    })

     xit("Should be able to pause the contract", async function () {
       const [owner, addr1, addr2] = await ethers.getSigners();
       const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
       const nft = await NFT.connect(owner).deploy();
       await nft.deployed();
       await nft.connect(owner).setPause(true);
       const pauseValue = await nft._paused();
       expect(pauseValue).to.equal(true);
     });

      xit("Should be able to burn nft", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
        const nft = await NFT.connect(owner).deploy();
        await nft.deployed();
        await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
        const balance = await nft.connect(addr1).totalNFTBalance();
        console.log("Original Balance", balance);
        await nft.connect(addr1).burn(addr1.address, 1, 1);
         const newbalance = await nft.connect(addr1).totalNFTBalance();
         console.log("New Balance", newbalance);
      });

      xit("Should be able to stake NFTs", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
        const nft = await NFT.deploy();
        await nft.deployed();
         const NFTStaking = await ethers.getContractFactory("NFTStaking");
         const nftstaking = await NFTStaking.deploy(nft.address);
         await nftstaking.deployed();
        await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
        await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
        await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
        await nft.connect(addr1).setApprovalForAll(nftstaking.address, true);
         await nftstaking.connect(addr1).stakeNFTs([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
         await network.provider.send("evm_increaseTime", [31536000]);
         await network.provider.send("evm_mine");
         await nftstaking.connect(addr1).updateStakingBalance();
         const stakingBalance = await nftstaking.connect(addr1).checkStakingBalance();
         const balance = await nft.connect(addr1).totalNFTBalance();
         console.log("Original Balance", balance)
         console.log(`\nStaking Balance: ${stakingBalance}\n`);
        const metadata = await nft.uri(0);
        console.log(`\nURL: ${metadata}\n`);
      });

      xit("Should be able to unstake NFTs", async function() {
           const [owner, addr1, addr2] = await ethers.getSigners();
           const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
           const nft = await NFT.deploy();
           await nft.deployed();
           const NFTStaking = await ethers.getContractFactory("NFTStaking");
           const nftstaking = await NFTStaking.deploy(nft.address);
           await nftstaking.deployed();
           await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
           await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
           await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
           await nft.connect(addr1).setApprovalForAll(nftstaking.address, true);
           await nftstaking.connect(addr1).stakeNFTs([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
           const oldTImeStamp = await nftstaking.stakingTimestamps("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
           console.log('oldTimestamp', oldTImeStamp)
           await nftstaking.connect(addr1).unstakeNFTs([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
           const newTimeStamp = await nftstaking.stakingTimestamps("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
           console.log('newTimeStamp', newTimeStamp);
      })

      xit("Should be able to claim staking rewards", async function() {
           const [owner, addr1, addr2] = await ethers.getSigners();
           const NFT = await ethers.getContractFactory("LJCryptoNFTCollection");
           const nft = await NFT.connect(owner).deploy();
           await nft.deployed();
           await nft
           const NFTStaking = await ethers.getContractFactory("NFTStaking");
           const nftstaking = await NFTStaking.deploy(nft.address);
           await nftstaking.deployed();
           await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
           await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
           await nft.connect(addr1).mintToken({ value: ethers.utils.parseEther("1") });
           await nft.connect(addr1).setApprovalForAll(nftstaking.address, true);
           await nftstaking.connect(addr1).stakeNFTs([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
           await network.provider.send("evm_increaseTime", [31536000]);
           await network.provider.send("evm_mine");
           await nft.connect(owner).mintTokensToStakingContract(nftstaking.address, 1000)
           await nftstaking.connect(addr1).claimNFTStakingRewards(15);
           const stakingIdBalance = await nft.connect(addr1).balanceOf("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 10);
           console.log('stakeId', stakingIdBalance);
      })
})