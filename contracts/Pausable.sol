// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./Ownable.sol";

/**
 * @dev A contract which makes it possible to pause/unpause certain the functions in a smart-contract.
 * @author merkle-groot
 */
contract Pausable is Ownable {
  bool public isPaused;

  modifier pauseLock() {
    require(!isPaused, "SC is Paused");
    _;
  }

  /**
   * @dev Causes any function with pauseLock modifier to be reverted
   * @notice Can only be called by the owner
   */
  function pause() external onlyOwner {
    isPaused = true;
  }

  /**
   * @dev Reverses the pause function effect
   * @notice Can only be called by the owner
   */
  function unPause() external onlyOwner {
    isPaused = false;
  }
}
