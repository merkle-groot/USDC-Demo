const main = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  Staking = await ethers.getContractFactory("StakingContractV2");
  [owner, addr1, addr2] = await ethers.getSigners();
  hardhatStaking = await upgrades.deployProxy(Staking, [
    "0x62f46d44751072626601ECC093b213ab9D5B2084",
    addr1.address,
    addr2.address,
  ]);
  await hardhatStaking.deployed();

  console.log("Staking Address V2 ", hardhatStaking.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
