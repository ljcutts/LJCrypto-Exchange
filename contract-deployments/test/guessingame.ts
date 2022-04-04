import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);

describe("GuessingGame", async function () {
  it("Should be able to enter game", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const guessingGame = await GuessingGame.deploy();
    await guessingGame.deployed();
    await guessingGame
      .connect(addr1)
      .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
    await guessingGame
      .connect(addr2)
      .enterGuessingGame({ value: ethers.utils.parseEther("0.1") });
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

  it("Should be able to change amount", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const guessingGame = await GuessingGame.connect(owner).deploy();
    await guessingGame.deployed();
    await guessingGame.generateRandomNumberValue(2);
    const value = await guessingGame.currentNumberValue();
    console.log(`\nNumber Value: ${ethers.utils.formatEther(value)}\n`);
  });

  it("Should not be able to change amount", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const guessingGame = await GuessingGame.connect(owner).deploy();
    await guessingGame.deployed();
    await guessingGame.connect(addr1).generateRandomNumberValue(5);
  });

//   it("Should be able to guess the answer", async function () {
//     const [owner, addr1, addr2] = await ethers.getSigners();
//     const GuessingGame = await ethers.getContractFactory("GuessingGame");
//     const guessingGame = await GuessingGame.connect(owner).deploy();
//     await guessingGame.deployed();
//     await guessingGame.connect(owner).generateRandomStringValue("Hello");
//     await guessingGame.connect(addr1).guessTheStringValue("0x06b3");
//   });
});
