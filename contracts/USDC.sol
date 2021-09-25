// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Mintable.sol";
import "./Pausable.sol";
import "./Ownable.sol";

        
/**
* @dev Implementation of ERC20 standard (https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
* @author merkle-groot
* @notice ERC-20 standard with extra functionality of Pausing and Minting.
*/
contract USDC is Pausable, Mintable{
    string public name = "USDC";
    string public symbol = "USDC";
    uint8 public decimals;
    uint256 public totalSupply;
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint8 _decimals, uint256 _initialSupply){

        decimals = _decimals;
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
        owner = msg.sender;

    }

    function transfer(
        address _to, 
        uint256 _value
    ) public pauseLock returns (bool sucess){

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;  

        return true;
    }

    function transferFrom(
        address _from, 
        address _to, 
        uint256 value
    ) public pauseLock returns (bool success){

        require(allowance[_from][msg.sender] >= value, "Unapproved tx");

        allowance[_from][msg.sender] -= value;
        balanceOf[_from] -= value;
        balanceOf[_to] += value;
       
        return true;   
    }

    function approve(
        address _spender, 
        uint256 value
    ) public pauseLock returns (bool success) {

        allowance[msg.sender][_spender] += value;

        return true;
    }

    function mintCoins(
        address _to,
        uint256 _amount
    ) external override onlyOwner returns(bool success){

        totalSupply += _amount;
        balanceOf[_to] += _amount;

        return true;
    }
 
}