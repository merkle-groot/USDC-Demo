// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

contract Ownable{
    address public owner;

    event OwnerChanged(
        address
    );

    modifier onlyOwner(){
        require(msg.sender == owner, "Unauthorized Access");
        _;
    }

    function changeOwner(address newOwner) external onlyOwner returns(bool success){
        require(newOwner != address(0));
        owner = newOwner;
        emit OwnerChanged(newOwner);
        return true;
    }

    function renounceOwnership() external onlyOwner returns(bool success){
        owner = address(0);
        emit OwnerChanged(owner);
        return true;
    }

    function returnOwner() external view returns(address){
        return owner;
    }


}