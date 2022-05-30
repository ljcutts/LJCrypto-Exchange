const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const LJCryptoAndStablePair = await ethers.getContractFactory("LJCryptoAndStablePair");
  const ljcryptoandstablepair = await LJCryptoAndStablePair.deploy(
    "0xe3271aD8DEc02000D78e3F58b658496a5563AE55",
    "0xA3F72Dc6CB13b72F85b3C755D151A903AAB3Fb76"
  );

  await ljcryptoandstablepair.deployed();

  console.log("LJCryptoAndStablePair deployed to:", ljcryptoandstablepair.address);

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
