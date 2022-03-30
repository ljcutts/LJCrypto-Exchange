import { expect } from "chai";
import { ethers } from "hardhat";

describe("LotteryGame", async function () {

// beforeEach(async() => {

// })

  it("Should be able to enter the game", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    await lotteryGame.connect(addr1).enterTheGame({value: ethers.utils.parseEther('1')});
    const inTheGame = await lotteryGame.connect(addr1).areYouIn();
    expect(inTheGame).to.equal(true)
    expect(await lotteryGame.entryAmount()).to.equal(ethers.utils.parseEther('1'))
    expect(await lotteryGame.maxPrize()).to.equal(
      ethers.utils.parseEther("1")
    );
    const deadline = await lotteryGame.deadline();
    console.log(deadline)
    
  });

  it("Should be able to change maxPrize", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const LotteryGame = await ethers.getContractFactory("LotteryGame");
    const lotteryGame = await LotteryGame.connect(owner).deploy(1, 1);
    await lotteryGame.deployed();
    const number = 2
    await lotteryGame.connect(owner).changeMaxPrize(number.toString())
    const newMaxPrize = await lotteryGame.maxPrize()
    expect(newMaxPrize).to.equal(ethers.utils.parseEther("2"))
  });

  //test the removeLotteryFunds, checkUpKeep and performUpKeep, other getter functions
});
