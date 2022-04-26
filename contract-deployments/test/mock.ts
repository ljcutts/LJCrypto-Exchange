import { expect } from "chai";
import { ethers, network } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);

describe("GuessingGame", async function() {
     await deployments.fixture(["mocks", "vrf"]);
})