async function main() {

    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  	console.log("Account balance:", (await deployer.getBalance()).toString());

    USDC = await ethers.getContractFactory("USDC");
    Staking = await ethers.getContractFactory("StakingContract");

    [owner, addr1] = await ethers.getSigners();
    hardhatUSDC = await USDC.deploy(2.7*10**13);
    hardhatStaking = await Staking.deploy(hardhatUSDC.address, addr1.address);
  
    console.log("USDC Address: " ,hardhatUSDC.address);
    console.log("Staking Address " ,hardhatStaking.address);
}
  
main()
    .then(
		() => process.exit(0))
    .catch(
		(error) => {
			console.error(error);
			process.exit(1);
		}
	);