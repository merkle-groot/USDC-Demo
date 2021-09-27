// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/**
* @dev A contract that allows special access to certain functions in an inherited smart-contract.
* @author merkle-groot
*/
contract Ownable{
    address public owner;

    event OwnerChanged(
        address
    );

    modifier onlyOwner(){
        require(msg.sender == owner, "Unauthorized Access");
        _;
    }

    /**
    * @dev Function which allows changing the owner of the contract
    * @notice Can only be called by the current owner of the contract
    * @param newOwner The address of the new owner
    * @return success boolean value
    */
    function changeOwner(address newOwner) external onlyOwner returns(bool success){
        require(newOwner != address(0));
        owner = newOwner;
        emit OwnerChanged(newOwner);
        return true;
    }

    /** 
    * @dev Function which allows the current owner to relinquish the ownership of the contract
    * @notice Can only be called by the current owner
    * @return success boolean value
    */
    function renounceOwnership() external onlyOwner returns(bool success){
        owner = address(0);
        emit OwnerChanged(owner);
        return true;
    }

    /**
    * @dev Function which retuns the current owner of the contract
    */
    function returnOwner() external view returns(address){
        return owner;
    }


}