// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "./Mintable.sol";
import "./Pausable.sol";
import "./Ownable.sol";

        
/**
* @dev Implementation of ERC20 standard (https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
* @author merkle-groot
* @notice ERC-20 standard with extra functionality of Pausing and Minting.
*/
contract USDC is Pausable, Mintable{
    string constant public name = "USDC";
    string constant public symbol = "USDC";
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

    constructor(uint8 decimalsPassed, uint256 initialSupply){

        decimals = decimalsPassed;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        owner = msg.sender;

    }

    function transfer(
        address to, 
        uint256 value
    ) external pauseLock returns (bool sucess){

        require(balanceOf[msg.sender] >= value, "Insufficient Balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;  

        return true;
    }

    function transferFrom(
        address from, 
        address to, 
        uint256 value
    ) external pauseLock returns (bool success){

        require(allowance[from][msg.sender] >= value, "Unapproved tx");

        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
       
        return true;   
    }

    function approve(
        address spender, 
        uint256 value
    ) external pauseLock returns (bool success) {

        allowance[msg.sender][spender] += value;

        return true;
    }

    function mintCoins(
        address to,
        uint256 amount
    ) external override onlyOwner returns(bool success){
        require(totalSupply + amount > totalSupply, "Overflow");
        totalSupply += amount;
        balanceOf[to] += amount;

        return true;
    }
 
}