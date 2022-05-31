import { ethers } from "hardhat";

async function main() {
  let [owner] = await ethers.getSigners()
  
  const Contract = await ethers.getContractFactory("CCERC20");
  const contract = await Contract.deploy(await owner.getAddress());
  await contract.deployed();
  console.log("deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
