import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const pressAnyKey = require("press-any-key");

describe("GuessingGame", async function () {
  xit("Should be able to enter game", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const guessingGame = await GuessingGame.deploy();
    await guessingGame.deployed();
    await guessingGame
      .connect(addr1)
      .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
    const joinTheGame = await guessingGame
      .connect(addr2)
      .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
    const theMsgSender = await guessingGame.connect(addr2).getMsgSender()
    const gameId = await guessingGame.currentGameId();
       await expect(joinTheGame)
         .to.emit(guessingGame, "CurrentGame")
         .withArgs(theMsgSender, gameId);
  });

  xit("Should not be able to enter game", async function () {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const guessingGame = await GuessingGame.deploy();
    await guessingGame.deployed();
    await guessingGame
      .connect(addr1)
      .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
    await guessingGame
      .connect(addr2)
      .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
    await guessingGame
      .connect(addr3)
      .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
  });

  // it("Should be able to change amount", async function () {
  //   const [owner, addr1, addr2] = await ethers.getSigners();
  //   const GuessingGame = await ethers.getContractFactory("GuessingGame");
  //   const guessingGame = await GuessingGame.connect(owner).deploy();
  //   await guessingGame.deployed();
  //   await guessingGame.generateRandomNumberValue(2);
  //   const value = await guessingGame.currentNumberValue();
  //   console.log(`\nNumber Value: ${ethers.utils.formatEther(value)}\n`);
  // });

  // xit("Should not be able to change amount", async function () {
  //   const [owner, addr1, addr2] = await ethers.getSigners();
  //   const GuessingGame = await ethers.getContractFactory("GuessingGame");
  //   const guessingGame = await GuessingGame.connect(owner).deploy();
  //   await guessingGame.deployed();
  //   await guessingGame.connect(addr1).generateRandomNumberValue(5);
  // });

  // it("Should be able to guess the amount", async function () {
  //   const [owner, addr1, addr2] = await ethers.getSigners();
  //   const GuessingGame = await ethers.getContractFactory("GuessingGame");
  //   const guessingGame = await GuessingGame.connect(owner).deploy();
  //   await guessingGame.deployed();
  //   await guessingGame.connect(owner).generateRandomNumberValue(2);
  //   await guessingGame.connect(addr1).enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
  //   await guessingGame.connect(addr2).enterGuessingGame({ value: ethers.utils.parseEther("10") });
  //   await guessingGame.connect(addr1).guessTheNumberValue(true);
  //   const addr1Balance = await guessingGame.connect(addr1).receiveBalance();
  //   const playerLength = await guessingGame.playerLength();
  //   const theNonce = await guessingGame.nonce();
  //   const gameId = await guessingGame.currentGameId();
  //   expect(playerLength).to.equal(0)
  //   expect(theNonce).to.equal(0);
  //   expect(gameId).to.equal(1);
  //   console.log(`\nBalance: ${ethers.utils.formatEther(addr1Balance)}\n`);
  // });


  // it("Should not be able to guess the amount", async function () {
  //   const [owner, addr1, addr2] = await ethers.getSigners();
  //   const GuessingGame = await ethers.getContractFactory("GuessingGame");
  //   const guessingGame = await GuessingGame.connect(owner).deploy();
  //   await guessingGame.deployed();
  //   await guessingGame.connect(owner).generateRandomNumberValue(2);
  //   await guessingGame.connect(addr1).enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
  //   await guessingGame.connect(addr2).enterGuessingGame({ value: ethers.utils.parseEther("10") });
  //   await guessingGame.connect(addr1).guessTheNumberValue(false);
  //   const theNonce = await guessingGame.nonce();
  //   const didYouGuess = await guessingGame.connect(addr1).didYouGuess();
  //   expect(didYouGuess).to.equal(true);
  //   expect(theNonce).to.equal(1);
  // });

  // xit("Should not be able to guess the amount", async function () {
  //   const [owner, addr1, addr2] = await ethers.getSigners();
  //   const GuessingGame = await ethers.getContractFactory("GuessingGame");
  //   const guessingGame = await GuessingGame.connect(owner).deploy();
  //   await guessingGame.deployed();
  //   await guessingGame.connect(owner).generateRandomNumberValue(2);
  //   await guessingGame
  //     .connect(addr1)
  //     .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
  //   await guessingGame
  //     .connect(addr2)
  //     .enterGuessingGame({ value: ethers.utils.parseEther("10") });
  //   await guessingGame.connect(addr1).guessTheNumberValue(false);
  //   const theNonce = await guessingGame.nonce();
  //   const didYouGuess = await guessingGame.connect(addr1).didYouGuess();
  //   expect(didYouGuess).to.equal(true);
  //   expect(theNonce).to.equal(1);
  // });

  it("Should delete players in array", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const guessingGame = await GuessingGame.connect(owner).deploy();
    await guessingGame.deployed();
    await guessingGame.connect(addr1).enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
    await guessingGame.connect(addr2).enterGuessingGame({ value: ethers.utils.parseEther("10") });
    await guessingGame.connect(addr1).guessTheNumberValue(true);
    await guessingGame.connect(addr2).guessTheNumberValue(true);
     const newNonce = await guessingGame.nonce();
    const didYouGuess = await guessingGame.connect(addr1).didYouGuess();
    const playerLength = await guessingGame.playerLength();
    expect(didYouGuess).to.equal(true);
    expect(newNonce).to.equal(0);
    expect(playerLength).to.equal(0);
  });

  xit("Should get a random value", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const guessingGame = await GuessingGame.connect(owner).deploy({value: ethers.utils.parseEther('1000')});
    await guessingGame.deployed();
    console.log(`Please fund ${guessingGame.address} with LINK`);
    await pressAnyKey();
    await guessingGame.connect(addr1).enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
    await guessingGame.connect(addr2).enterGuessingGame({ value: ethers.utils.parseEther("10") });
    await sleep(30000);
    const currenntNumber = await guessingGame.currentNumberValue();
    console.log(`\nNumber: ${currenntNumber}\n`);
  });



  // it("asfasfsa", async function() {
  //    const [owner, addr1, addr2] = await ethers.getSigners();
  //    const GuessingGame = await ethers.getContractFactory("GuessingGame");
  //    const guessingGame = await GuessingGame.connect(owner).deploy();
  //    await guessingGame.deployed();
  //    await guessingGame.guessTheHash("0x48656c6c6f");
  // })

//   it("Should be able to guess the answer", async function () {
//     const [owner, addr1, addr2] = await ethers.getSigners();
//     const GuessingGame = await ethers.getContractFactory("GuessingGame");
//     const guessingGame = await GuessingGame.connect(owner).deploy();
//     await guessingGame.deployed();
//     await guessingGame.connect(owner).generateRandomStringValue("Hello");
//     await guessingGame.connect(addr1).guessTheStringValue("0x06b3");
//   });
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}