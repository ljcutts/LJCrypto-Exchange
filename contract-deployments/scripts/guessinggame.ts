// const { ethers } = require("hardhat");
// const hre = require("hardhat");
// require("dotenv").config({ path: ".env" });
// require("@nomiclabs/hardhat-etherscan");

// async function main() {
//   const GuessingGame = await ethers.getContractFactory("GuessingGame");
//   const guessingGame = await GuessingGame.deploy({
//     value: ethers.utils.parseEther("0.2"),
//   });

//   await guessingGame.deployed();

//   console.log("GuessingGame deployed to:", guessingGame.address);

//   console.log("Sleeping.....");
//   // Wait for etherscan to notice that the contract has been deployed
//   await sleep(30000);

//   // Verify the contract after deploying
//   await hre.run("verify:verify", {
//     address: guessingGame.address,
//   });
// }

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// })
