let currStakingAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

const main = async () => {
  Staking = await ethers.getContractFactory("StakingContract");
  StakingV2 = await ethers.getContractFactory("StakingContractV2");

  [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

  hardhatStaking = await Staking.attach(currStakingAddress);
  hardhatStakingV2 = await upgrades.upgradeProxy(hardhatStaking.address, StakingV2);

  console.log("Upgraded smart-contract to V2", hardhatStakingV2.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
