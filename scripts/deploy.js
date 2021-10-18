const main = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  USDC = await ethers.getContractFactory("USDC");
  Staking = await ethers.getContractFactory("StakingContract");

  [owner, addr1, addr2] = await ethers.getSigners();
  hardhatUSDC = await USDC.deploy(2.1 * 10 ** 7, addr1.address, addr2.address);
  hardhatStaking = await upgrades.deployProxy(Staking, [
    hardhatUSDC.address,
    addr1.address,
    addr2.address,
  ]);
  await hardhatStaking.deployed();

  console.log("USDC Address: ", hardhatUSDC.address);
  console.log("Staking Address ", hardhatStaking.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
