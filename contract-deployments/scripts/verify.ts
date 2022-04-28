// const { ethers } = require("hardhat");
// const hre = require("hardhat");
// require("dotenv").config({ path: ".env" });
// require("@nomiclabs/hardhat-etherscan");

// async function main() {

//   console.log("Sleeping.....");
//   // Wait for etherscan to notice that the contract has been deployed
//   await sleep(30000);

//   // Verify the contract after deploying
//   await hre.run("verify:verify", {
//     address: "0x5ea7aDCaBBFb3CB48E27818BF81a8F2bad2aa7d1",
//   });
// }

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // Call the main function and catch if there is any error
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
