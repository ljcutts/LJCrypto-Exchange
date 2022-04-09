import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);


describe("LJStablecoin", async function() {
    it("Should be able to get price", async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
      const ljstablecoin = await LJStableCoin.connect(owner).deploy(
        "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB"
      );
      await ljstablecoin.deployed();

      const latestPrice = await ljstablecoin.getLatestPrice()
     console.log(ethers.utils.formatEther(latestPrice));

      
    });
})