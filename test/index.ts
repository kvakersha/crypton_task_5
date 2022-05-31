import { expect } from "chai";
import { ethers } from "hardhat";
import { getSignature } from "../utils/getSignature"

describe("Test erc20", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [owner] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("CCERC20");
    const token = await Contract.deploy(await owner.getAddress());
    await token.deployed();

    const targetChainId = (await ethers.provider.getNetwork()).chainId
    
    let txSwap = await token.swap(1000, targetChainId)
    expect((await txSwap.wait())['events']![1]['event']).to.be.equal("Swap")

    let timestamp = 123;

    let sig = await getSignature(token.address, owner, targetChainId, targetChainId, timestamp)
    
    let redeem = await token.redeem(1000, targetChainId, targetChainId, timestamp, sig)
    await redeem.wait()

    expect(await token.balanceOf(await owner.getAddress())).to.be.equal("1000000000000000000000")
    //starting balance = 1000000000000000000000
    //swap -= 1000
    //redeem += 1000

    await expect(token.redeem(1000, targetChainId, targetChainId, timestamp, sig)).to.be.reverted
  });
});
