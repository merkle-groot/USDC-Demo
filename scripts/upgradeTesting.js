const main = async () => {
  USDC = await ethers.getContractFactory("USDC");
  Staking = await ethers.getContractFactory("StakingContract");
  StakingV2 = await ethers.getContractFactory("StakingContractV2");

  [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
  hardhatUSDC = await USDC.deploy(
    2.1 * 10 ** 7,
    addr1.address,
    addr2.address
  );

  hardhatStaking = await upgrades.deployProxy(Staking, [
    hardhatUSDC.address,
    addr1.address,
    addr2.address,
  ]);

  hardhatStakingV2 = await upgrades.upgradeProxy(hardhatStaking.address, StakingV2);

  console.log(hardhatStakingV2.abi);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
