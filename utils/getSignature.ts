import { exit, mainModule } from "process";

const { ethers } = require("hardhat");

interface Redeem {
    _addr: string;
    _amount: number;
    _oldChainId: number;
    _chainId: number;
    _timestamp: number;
}
  
const Redeem = {
    Redeem: [
        { name: "_addr", type: "address" },
        { name: "_amount", type: "uint256" },
        { name: "_oldChainId", type: "uint256" },
        { name: "_chainId", type: "uint256" },
        { name: "_timestamp", type: "uint256" },
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

export async function getSignature(erc20addr: any, owner: any, oldChainId: any, chainId: any, timestamp: any){
    const domain = eip712Domain(erc20addr, (await ethers.provider.getNetwork()).chainId);
    const signature  = await owner._signTypedData(domain, 
        Redeem, {
            _addr: await owner.getAddress(),
            _amount: 1000,
            _oldChainId: oldChainId,
            _chainId: chainId,
            _timestamp: timestamp
        }
    );

    return signature;
}

