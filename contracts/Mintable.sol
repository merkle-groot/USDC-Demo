// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/**
* @dev An abstract contract that declares the mint function which is overriden by USDC contract
* @author merkle-groot
*/
abstract contract Mintable{

    /**
    * @dev Virtual function which will be overidden in USDC contract
    * @param _to The address to which the minted tokens should be airdropped
    * @param _amount The amount of tokens which be minted
    */
    function mintCoins(address _to, uint256 _amount) external virtual returns(bool success);
}