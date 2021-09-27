// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./Mintable.sol";
import "./Pausable.sol";


        
/**
* @dev Implementation of ERC20 standard (https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
* @author merkle-groot
* @notice ERC-20 standard with extra functionality of Pausing and Minting.
*/
contract USDC is Pausable, Mintable {
    string constant public name = "USDC";
    string constant public symbol = "USDC";
    uint8 constant public decimals = 6;
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

    /**
    * @dev Constructor of the contract
    * @notice Allows the deployer of the contract to specify the number of tokens in existence when deployed (which can be changed later with mintCoins fn)
    * @param initialSupply Sets the initial supply of the ERC20 token
    */
    constructor(uint256 initialSupply){

        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        owner = msg.sender;

    }

    /**
    * @dev Standard ERC20 transfer fn
    * @notice The function which is used to send tokens between accounts, contract.
    * @param to The address to which the tokens are to be sent
    * @param value The number of tokens that are to be sent
    * @return success Boolean value
    */
    function transfer(
        address to, 
        uint256 value
    ) external pauseLock returns (bool success){

        require(balanceOf[msg.sender] >= value, "Insufficient Balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;  

        return true;
    }

    /**
    * @dev Standard ERC20 transferFrom fn
    * @notice The function which allows an account to spend approved amounts of tokens on behalf of another account
    * @param from The address whose tokens will be spent
    * @param to The address to which wokens will be sent
    * @param value The number of tokens that are to be sent
    * @return success boolean value
     */
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

    /**
    * @dev Standard ERC20 approve fn
    * @notice The function which allows an account to approve a certain amount of tokens to spent by another account
    * @param spender The address which will spend the tokens on behalf of the user
    * @param value The number of tokens that are to be approved
    * @return success boolean value
     */
    function approve(
        address spender, 
        uint256 value
    ) external pauseLock returns (bool success) {

        allowance[msg.sender][spender] += value;

        return true;
    }

    /**
    * @dev Allows increasing the totalSupply by minting new coins
    * @notice THe function which allows the owner of the contract to mint new coins
    * @param to The address to which the new coins will be airdropped
    * @param amount Th number of coins to be minted
    * @return success boolean value
    */
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