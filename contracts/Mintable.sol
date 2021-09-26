// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

abstract contract Mintable{
    function mintCoins(address _to, uint256 _amount) external virtual returns(bool success);
}