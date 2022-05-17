// const { ethers } = require("hardhat");
// require("dotenv").config({ path: ".env" });

// async function main() {
//   const NFTStaking = await ethers.getContractFactory("NFTStaking");
//   const nftstaking = await NFTStaking.deploy(
//     "0xBC30600bbD35bBfA39B9eF515E1a4D3C0c24c0D6"
//   );

//   await nftstaking.deployed();

//   console.log(
//     "NFTStaking deployed to:",
//     nftstaking.address
//   );

// }
// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// })
