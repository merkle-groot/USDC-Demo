// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ownable{
    address public owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "Unauthorized Access");
        _;
    }

    function changeOwner(address newOwner) external onlyOwner returns(bool success){
        owner = newOwner;
        return true;
    }

    function renounceOwnership() external onlyOwner returns(bool success){
        owner = address(0);
        return true;
    }

    function returnOwner() external view returns(address){
        return owner;
    }


}