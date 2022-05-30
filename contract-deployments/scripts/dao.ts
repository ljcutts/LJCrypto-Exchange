// const { ethers } = require("hardhat");
// require("dotenv").config({ path: ".env" });

// async function main() {
//   const LJCryptoDao = await ethers.getContractFactory("LJCryptoDAO");
//   const ljcryptodao = await LJCryptoDao.deploy(
//     "0xBC30600bbD35bBfA39B9eF515E1a4D3C0c24c0D6",
//     "0xe3271aD8DEc02000D78e3F58b658496a5563AE55"
//   );

//   await ljcryptodao.deployed();

//   console.log("LJCryptoDao deployed to:", ljcryptodao.address);

// }
// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// })