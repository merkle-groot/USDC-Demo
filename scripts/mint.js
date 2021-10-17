async function main() {
	const [deployer] = await ethers.getSigners();

	console.log("Account balance:", (await deployer.getBalance()).toString());

	USDC = await ethers.getContractFactory("USDC");

	[owner, addr1] = await ethers.getSigners();
	hardhatUSDC = await USDC.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

	await hardhatUSDC.mintCoins(owner.address, 420 * 10 ** 6);

	const currentTotalSupply = await hardhatUSDC.totalSupply();
	console.log(currentTotalSupply);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
