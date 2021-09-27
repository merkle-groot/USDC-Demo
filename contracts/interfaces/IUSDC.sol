// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

interface IUSDC{
    function approve(
        address spender,
        uint256 value
    ) external returns(bool success);

    function transferFrom(
        address from, 
        address to, 
        uint256 value
    ) external returns (bool success);

    function transfer(
        address to, 
        uint256 value
    ) external returns (bool sucess);
}