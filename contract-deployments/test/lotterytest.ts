import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);

describe("LotteryGame", async function () {
  it("Should be able to enter the game", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    const joinGame = await lotteryGame.connect(addr1).enterTheGame({ value: ethers.utils.parseEther("1") });
    const lotteryDay = await lotteryGame.lotteryDay()
    const theMsgSender = await lotteryGame.connect(addr1).getMsgSender()
    const entryAmount = await lotteryGame.entryAmount()
    await expect(joinGame).to.emit(lotteryGame, "PlayersOnLotteryDay").withArgs(theMsgSender,lotteryDay,entryAmount);
    const inTheGame = await lotteryGame.connect(addr1).areYouIn();
    expect(inTheGame).to.equal(true);
    expect(await lotteryGame.entryAmount()).to.equal(ethers.utils.parseEther("1"));
    expect(await lotteryGame.maxPrize()).to.equal(ethers.utils.parseEther("1"));
    const deadline = await lotteryGame.deadline();
    console.log(deadline);
  });

  it("Should have a different player length", async function() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    await lotteryGame.connect(addr1).enterTheGame({ value: ethers.utils.parseEther("1") });
    await lotteryGame.connect(addr2).enterTheGame({ value: ethers.utils.parseEther("1") });
    const playerLength = await lotteryGame.playerCount()
    console.log(`\nAmount of Players in: ${playerLength}\n`);
    expect(playerLength).to.equal(2)
  })

  it("Should be able to receive all players", async function () {
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    await lotteryGame.connect(owner).enterTheGame({ value: ethers.utils.parseEther("1") });
    await lotteryGame.connect(addr1) .enterTheGame({ value: ethers.utils.parseEther("1") });
    await lotteryGame.connect(addr2).enterTheGame({ value: ethers.utils.parseEther("1") });
    await lotteryGame.connect(addr3).enterTheGame({ value: ethers.utils.parseEther("1") });
    await lotteryGame.connect(addr4).enterTheGame({ value: ethers.utils.parseEther("1") });
    const allthePlayers = await lotteryGame.getAllPlayers();
    console.log(`\nAll players: ${allthePlayers}\n`);
  });

  xit("Should not be able to enter the game", async function() {
   const [owner, addr1, addr2] = await ethers.getSigners();
   const LotteryGame = await ethers.getContractFactory("LotteryGame");
   const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
   await lotteryGame.deployed();
   const cantEnter = await lotteryGame.connect(addr1).enterTheGame();
   await expect(cantEnter).to.be.reverted;
  })

  it("Should be able to change maxPrize", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    const number = 2;
    await lotteryGame.connect(owner).changeMaxPrize(number.toString());
    const newMaxPrize = await lotteryGame.maxPrize();
    expect(newMaxPrize).to.equal(ethers.utils.parseEther("2"));
  });

  xit("Should not be able to change maxPrize", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    const number = 2;
    const cantChangePrize = await lotteryGame.connect(addr1).changeMaxPrize(number.toString());
    expect(cantChangePrize).to.be.reverted
  });

   it("Should be able to change entryAmount", async function () {
     const [owner, addr1, addr2] = await ethers.getSigners();
     const LotteryGame = await ethers.getContractFactory("LotteryGame");
     const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
     await lotteryGame.deployed();
     const number = 2;
     await lotteryGame.connect(owner).changeEntryAmount(number.toString());
     const newEntryAmount = await lotteryGame.entryAmount();
     expect(newEntryAmount).to.equal(ethers.utils.parseEther("2"));
   });

   xit("Should not be able to change entryAmount", async function () {
     const [owner, addr1, addr2] = await ethers.getSigners();
     const LotteryGame = await ethers.getContractFactory("LotteryGame");
     const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
     await lotteryGame.deployed();
     const number = 2;
     const cantChange = await lotteryGame.connect(addr1).changeEntryAmount(number.toString());
     expect(cantChange).to.be.reverted;
   });

  it("Should be able to remove funds from lottery", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    await lotteryGame.connect(owner).enterTheGame({ value: ethers.utils.parseEther("100") });
    const contractBalance = await lotteryGame.balanceOfContract()
    console.log(`\nInital Balance: ${contractBalance}\n`);
    expect(contractBalance).to.equal(ethers.utils.parseEther('100'))
    await lotteryGame.connect(owner).removeLotteryFunds();
  });

  xit("Should not be able to remove funds from lottery", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    await lotteryGame.connect(owner).enterTheGame({ value: ethers.utils.parseEther("100") });
    const contractBalance = await lotteryGame.balanceOfContract();
    expect(contractBalance).to.equal(ethers.utils.parseEther("100"));
    const cantRemoveFunds = await lotteryGame.connect(addr1).removeLotteryFunds();
    expect(cantRemoveFunds).to.be.reverted
  });








  /* THIS IS FOR TESTING CHAINLINK KEEPERS AND CHAINLINK VRF*/



  //test the removeLotteryFunds, checkUpKeep and performUpKeep, other getter functions
  //https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#
});
