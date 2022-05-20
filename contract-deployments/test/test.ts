import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);

describe("dsafa", async function() {
    it("should do something", async function() {
        console.log(ethers.utils.parseUnits("1", 1));
    })
})