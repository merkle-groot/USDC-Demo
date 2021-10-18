// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StakingContract.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract StakingContractV2 is StakingContract{
    using SafeERC20Upgradeable for IERC20Upgradeable;
    function stake(uint256 amount) external virtual override{
        erc20Address.safeTransferFrom(msg.sender, address(this), amount);
        uint256 fee = (amount*4)/1000;
        feesCollected += fee;
        // console.log("The fee in this case is: ", feesCollected);
        
        staked[msg.sender] = StakeDetails({stakedAmount: amount - fee, stakedTimestamp: block.timestamp});
        emit StakedEvent(msg.sender, amount, block.timestamp);
    }
}