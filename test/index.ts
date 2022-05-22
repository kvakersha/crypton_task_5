import { expect } from "chai";
import { ethers } from "hardhat";
import { getSignature } from "../utils/getSignature"

describe("Test erc20", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [owner] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("CCERC20");
    const token = await Contract.deploy(await owner.getAddress());
    await token.deployed();

    let txSwap = await token.swap(1000)
    expect((await txSwap.wait())['events']![1]['event']).to.be.equal("Swap")

    let sig = await getSignature(token.address, owner)
    
    console.log(await token.verifySignature(1000, await owner.getAddress(), sig));
    console.log(await owner.getAddress());
    
    let redeem = await token.redeem(1000, sig)
    await redeem.wait()
    
    expect(await token.balanceOf(await owner.getAddress())).to.be.equal("1000000000000000000000")
    //starting balance = 1000000000000000000000
    //swap -= 1000
    //redeem += 1000
  });
});
