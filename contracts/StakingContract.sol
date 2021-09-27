// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./interfaces/IERC20.sol";
import "./libraries/SafeERC20.sol";
import "./Ownable.sol";

/**
* @dev Allows staking of ERC-20 tokens
* @author merkle-groot
* @notice Stake ERC-20 tokens for a small fee
*/
contract StakingContract is Ownable{
    using SafeERC20 for IERC20;

    struct StakeDetails{
        uint256 stakedAmount;
        uint256 stakedTimestamp;
    }

    IERC20 public immutable erc20Address;
    mapping(
        address => StakeDetails
    ) public staked;
    uint256 public feesCollected;
    address public treasury;

    event StakedEvent(
        address, 
        uint256, 
        uint256
    );
    event UnstakedEvent(
        address, 
        uint256, 
        uint256
    );
    event TreasuryAddressChanged(
        address
    );

    /**
    * @dev Constructor for the contract
    * @notice Initilize the token,treasury and Owner addresses
    * @param tokenAddress Address of the required token
    * @param treasuryAddress Address to which the collected fees are to be sent
    */
    constructor(
        IERC20 tokenAddress,
        address treasuryAddress
    ){
        erc20Address = tokenAddress;
        owner = msg.sender;
        changeTreasuryAddress(treasuryAddress);
    }

    /**
    * @dev Function that allows staking of the tokens
    * @notice 0.002% of the staked coins is collected as fees by the protocol
    * @param amount The number of tokens to be staked
    */
    function stake(uint256 amount) external{
        erc20Address.safeTransferFrom(msg.sender, address(this), amount);
        uint256 fee = (amount*2)/1000;
        feesCollected += fee;
        // console.log("The fee in this case is: ", feesCollected);
        
        staked[msg.sender] = StakeDetails({stakedAmount: amount - fee, stakedTimestamp: block.timestamp});
        StakedEvent(msg.sender, amount, block.timestamp);
    }

    /**
    * @dev Function that allows unstaking the tokens
    * @notice Can only be called 2hrs after staking
    * @notice You can only unstake (deposited amount - fee)
    * @param amount The number of tokens to be unstaked
    */
    function unStake(uint256 amount) external{
        StakeDetails storage stakeDetails = staked[msg.sender];
        require(block.timestamp - stakeDetails.stakedTimestamp >= 2 hours, "Wait until unlock period");
        require(stakeDetails.stakedAmount >= amount, "Cannot unstake more than the deposited amount.");

        stakeDetails.stakedAmount -= amount;
        erc20Address.safeTransfer(msg.sender, amount);
        UnstakedEvent(msg.sender, amount, block.timestamp); 
    }

    /**
    * @dev Function that allows changing the treasury address
    * @notice Can only be called by the owner of the contract
    * @param newTreasuryAddress The new address to which the collected fees will be spent
     */
    function changeTreasuryAddress(address newTreasuryAddress) public onlyOwner{
        require(newTreasuryAddress != address(0), "Non zero address required");
        treasury = newTreasuryAddress;
        TreasuryAddressChanged(newTreasuryAddress);
    }


    /**
    * @dev Function that allows withdrawing the collected fees to the treasury address
    * @notice Can only be callaed the by the owner
    */
    function collectFees() external onlyOwner{
        erc20Address.safeTransfer(treasury, feesCollected);
    }
}
