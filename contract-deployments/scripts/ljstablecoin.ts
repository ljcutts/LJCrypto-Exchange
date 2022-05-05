const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const LJStableCoin = await ethers.getContractFactory("LJStableCoin");
  const ljstablecoin = await LJStableCoin.deploy();

  await ljstablecoin.deployed();

  console.log("LJStableCoin deployed to:", ljstablecoin.address);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
