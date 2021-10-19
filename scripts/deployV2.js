const main = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  Staking = await ethers.getContractFactory("StakingContractV2");
  USDC = await ethers.getContractFactory("USDC");

  [owner, addr1, addr2] = await ethers.getSigners();
  hardhatUSDC = await USDC.deploy(2.1 * 10 ** 7, addr1.address, addr2.address);

  hardhatStaking = await upgrades.deployProxy(Staking, [
    hardhatUSDC.address,
    addr1.address,
    addr2.address,
  ]);
  await hardhatStaking.deployed();

  console.log("USDC Address: ", hardhatUSDC.address);
  console.log("Staking Address V2 ", hardhatStaking.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
