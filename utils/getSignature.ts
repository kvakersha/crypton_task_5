import { exit, mainModule } from "process";

const { ethers } = require("hardhat");

interface Swap {
    _addr: string;
    _amount: number;
}
  
const Swap = {
    Swap: [
        { name: "_addr", type: "address" },
        { name: "_amount", type: "uint256" },
    ],
};
  
function eip712Domain(
    contractAddress: string,
    chainId: any
): Record<string, any> {
    return {
        name: "name",
        version: "version",
        chainId: chainId,
        verifyingContract: contractAddress,
    };
}

export async function getSignature(erc20addr: any, owner: any){
    const domain = eip712Domain(erc20addr, (await ethers.provider.getNetwork()).chainId);
    const signature  = await owner._signTypedData(domain, Swap, {
        _addr: await owner.getAddress(),
        _amount: 1000
    });

    return signature;
}

