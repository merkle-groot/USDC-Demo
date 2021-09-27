// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "./interfaces/IUSDC.sol";
import "./Ownable.sol";
// import "hardhat/console.sol";

contract StakingContract is Ownable{
    struct StakeDetails{
        uint256 stakedAmount;
        uint256 stakedTimestamp;
    }

    event StakedEvent(address, uint256, uint256);
    event UnstakedEvent(address, uint256, uint256);


    address public immutable erc20Address;
    mapping(address => StakeDetails) public staked;
    uint256 public feesCollected;
    address public treasury;

    event TreasuryAddressChanged(address);

    constructor(
        address tokenAddress,
        address treasuryAddress
    ){
        erc20Address = tokenAddress;
        owner = msg.sender;
        changeTreasuryAddress(treasuryAddress);
    }

    function stake(uint256 amount) external{
        IUSDC(erc20Address).transferFrom(msg.sender, address(this), amount);
        uint256 fee = (amount*2)/1000;
        feesCollected += fee;
        // console.log("The fee in this case is: ", feesCollected);
        
        staked[msg.sender] = StakeDetails({stakedAmount: amount - fee, stakedTimestamp: block.timestamp});
        StakedEvent(msg.sender, amount, block.timestamp);
    }

    function unStake(uint256 amount) external{
        StakeDetails storage stakeDetails = staked[msg.sender];
        require(block.timestamp - stakeDetails.stakedTimestamp >= 2 hours, "Wait until unlock period");
        require(stakeDetails.stakedAmount >= amount, "Cannot unstake more than the deposited amount.");

        stakeDetails.stakedAmount -= amount;
        IUSDC(erc20Address).transfer(msg.sender, amount);
        UnstakedEvent(msg.sender, amount, block.timestamp); 
    }

    function changeTreasuryAddress(address newTreasuryAdress) public onlyOwner{
        treasury = newTreasuryAdress;
        TreasuryAddressChanged(newTreasuryAdress);
    }

    function collectFees() external onlyOwner{
        IUSDC(erc20Address).transfer(treasury, feesCollected);
    }
}
