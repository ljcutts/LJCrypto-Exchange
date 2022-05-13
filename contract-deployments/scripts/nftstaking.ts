const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const NFTStaking = await ethers.getContractFactory("NFTStaking");
  const nftstaking = await NFTStaking.deploy("0xe96Cbef4EE34f17D4B5f3e00852c50621B49018F");

  await nftstaking.deployed();

  console.log(
    "NFTStaking deployed to:",
    nftstaking.address
  );

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
