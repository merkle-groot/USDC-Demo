// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "./Ownable.sol";

contract Pausable is Ownable{
    bool public isPaused;


    modifier pauseLock(){
        require(!isPaused, "SC is Paused");
        _;
    }

    function pause() external onlyOwner{
        isPaused = true;
    }

    function unPause() external onlyOwner{
        isPaused = false;
    }



}