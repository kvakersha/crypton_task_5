//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CCERC20 is ERC20, EIP712 {
    event Swap(address _addr, uint256 _amount, uint256 _targetOriginId);
    address public signer;

    constructor(address _signer) ERC20("name", "symbol") EIP712("name", "version") {
        signer = _signer;

        _mint(msg.sender, 1000 ether);
    }

    function swap(uint256 _amount, uint256 _targetOriginId) external {
        _burn(msg.sender, _amount);
        emit Swap(msg.sender, _amount, _targetOriginId);
    }

    function redeem(uint256 _amount, uint256 _oldChainId, uint256 _originId, uint256 _timestamp, bytes memory _signature) external {
        require(
            !used[_signature]  
            && verifySignature(_amount, msg.sender, _oldChainId, _originId, _timestamp, _signature) == signer
            && _originId == block.chainid,
            "Bad Signature");
        used[_signature] = true;
        _mint(msg.sender, _amount);
    } 

    mapping(bytes => bool) public used;
    bytes32 private constant hash = keccak256("Redeem(address _addr,uint256 _amount,uint256 _oldChainId,uint256 _chainId,uint256 _timestamp)");
    
    function verifySignature(uint256 _amount, address _addr, uint256 _oldChainId, uint256 _chainId,uint256 _timestamp,bytes memory _signature) public view returns (address) {
        bytes32 _digest = _hashTypedDataV4(
            keccak256(abi.encode(hash, _addr, _amount, _oldChainId, _chainId, _timestamp))
        );
        return ECDSA.recover(_digest, _signature);
    }
}

