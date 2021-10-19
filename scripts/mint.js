const currUSDCAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Account Ether balance:", (await deployer.getBalance()).toString());

  USDC = await ethers.getContractFactory("USDC");

  [owner, addr1] = await ethers.getSigners();
  hardhatUSDC = await USDC.attach(currUSDCAddress);

  await hardhatUSDC.testMint(owner.address);

  const currentTotalSupply = await hardhatUSDC.totalSupply();
  console.log("Minted 1000 USDC to owner address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
