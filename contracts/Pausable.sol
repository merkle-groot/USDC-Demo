// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract Pausable is Ownable{
    bool public isPaused;


    modifier pauseLock(){
        require(isPaused == false, "SC is Paused");
        _;
    }

    function pause() external onlyOwner{
        isPaused = true;
    }

    function unPause() external onlyOwner{
        isPaused = false;
    }



}