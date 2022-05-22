//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CCERC20 is ERC20, EIP712 {
    event Swap(address _addr, uint256 _amount);
    address public signer;

    constructor(address _signer) ERC20("CCToken", "CCT") EIP712("name", "version") {
        signer = _signer;

        _mint(msg.sender, 1000 ether);
    }

    function swap(uint256 _amount) external {
        _burn(msg.sender, _amount);
        emit Swap(msg.sender, _amount);
    }

    function redeem(uint256 _amount, bytes memory _signature) external {
        require(verifySignature(_amount, msg.sender, _signature) == signer, "Bad Signature"); 
        _mint(msg.sender, _amount);
    } 

    bytes32 private constant hash = keccak256("Swap(address _addr,uint256 _amount)");
    
    function verifySignature(uint256 _amount, address _addr, bytes memory _signature) public view returns (address) {
        bytes32 _digest = _hashTypedDataV4(
            keccak256(abi.encode(hash, _addr, _amount))
        );
        return ECDSA.recover(_digest, _signature);
    }
}
