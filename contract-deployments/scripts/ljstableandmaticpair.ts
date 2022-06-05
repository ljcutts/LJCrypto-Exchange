const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const LJStableAndMaticPair = await ethers.getContractFactory("LJStableAndMaticPair");
  const ljstableoandmaticpair = await LJStableAndMaticPair.deploy(
    "0xA3F72Dc6CB13b72F85b3C755D151A903AAB3Fb76"
  );

  await ljstableoandmaticpair.deployed();

  console.log(
    "LJStableAndMaticPair deployed to:",
    ljstableoandmaticpair.address
  );

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
