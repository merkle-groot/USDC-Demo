const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Staking", function () {
    let USDC;
    let hardhatUSDC;
    let Staking;
    let hardhatStaking;

    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;
    let treasuryRole;
    let defaultAdmin;

    beforeEach(async function () {
        USDC = await ethers.getContractFactory("USDC");
        Staking = await ethers.getContractFactory("StakingContract");

        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        hardhatUSDC = await USDC.deploy(2.1 * 10 ** 7, addr1.address, addr2.address);
        hardhatStaking = await Staking.deploy(hardhatUSDC.address, addr1.address, addr2.address);
        treasuryRole = await hardhatStaking.TREASURY_ROLE();
        defaultAdmin = await hardhatUSDC.DEFAULT_ADMIN_ROLE();

        await hardhatUSDC.transfer(addr1.address, 10000 * 10 ** 6);
    });

    describe("Staking Related", function () {
        it("Should initialize the right USDC contract", async function () {
            const tokenAddress = await hardhatStaking.erc20Address();
            expect(hardhatUSDC.address).to.be.equal(tokenAddress);
        });

        it("Should be able to stake required amount of tokens", async function () {
            await hardhatUSDC
                .connect(addr1)
                .approve(hardhatStaking.address, 555 * 10 ** 6);
            await hardhatStaking.connect(addr1).stake(555 * 10 ** 6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89 * 10 ** 6);
        });

        it("Should collect right amount of fee", async function () {
            await hardhatUSDC
                .connect(addr1)
                .approve(hardhatStaking.address, 1999 * 10 ** 6);
            await hardhatStaking.connect(addr1).stake(1999 * 10 ** 6);
            const totalFees = await hardhatStaking.feesCollected();
            expect(totalFees).to.be.equal(3.998 * 10 ** 6);

            await hardhatUSDC
                .connect(addr1)
                .approve(hardhatStaking.address, 555 * 10 ** 6);
            await hardhatStaking.connect(addr1).stake(555 * 10 ** 6);
            const newTotalFees = await hardhatStaking.feesCollected();
            expect(newTotalFees).to.be.equal(5.108 * 10 ** 6);
        });

        it("Should fail if tried to unstake before 2 hours", async function () {
            await hardhatUSDC
                .connect(addr1)
                .approve(hardhatStaking.address, 555 * 10 ** 6);
            await hardhatStaking.connect(addr1).stake(555 * 10 ** 6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89 * 10 ** 6);

            await expect(
                hardhatStaking.connect(addr1).unStake(553.89 * 10 ** 6)
            ).to.be.revertedWith("Wait until unlock period");
        });

        it("Should be able to unstake after 2 hours", async function () {
            await hardhatUSDC
                .connect(addr1)
                .approve(hardhatStaking.address, 555 * 10 ** 6);
            await hardhatStaking.connect(addr1).stake(555 * 10 ** 6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89 * 10 ** 6);

            await network.provider.send("evm_increaseTime", [7200]);
            expect(await hardhatStaking.connect(addr1).unStake(553.89 * 10 ** 6));
        });

        it("Should fail if tried to unstake more than the amount that was put in even after 2 hours", async function () {
            await hardhatUSDC
                .connect(addr1)
                .approve(hardhatStaking.address, 555 * 10 ** 6);
            await hardhatStaking.connect(addr1).stake(555 * 10 ** 6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89 * 10 ** 6);

            await network.provider.send("evm_increaseTime", [7200]);
            await expect(
                hardhatStaking.connect(addr1).unStake(555 * 10 ** 6)
            ).to.be.revertedWith("Cannot unstake more than the deposited amount.");
        });
    });

    describe("Access Roles", function () {

        it("Admin of TreasuryRole must be the default admin", async function () {
            await expect(
                await hardhatStaking.getRoleAdmin(treasuryRole)
            ).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
        });

        it("Default Admin should be able to grant new treasuryRole", async function () {
            await hardhatStaking.grantRole(treasuryRole, addrs[0].address);

            expect(
                await hardhatStaking.hasRole(treasuryRole, addrs[0].address)
            ).to.be.true;
        });

        it("No other account should be able to grant new minter and pauser", async function () {
            await expect(
                hardhatStaking.connect(addrs[0]).grantRole(treasuryRole, addrs[0].address)
            ).to.be.revertedWith(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addrs[0].address.toLowerCase()} is missing role ${defaultAdmin}`);

        });

        it("Default Admin should be able to revoke the current treasury role", async function () {
            await hardhatStaking.revokeRole(treasuryRole, addr1.address);

            expect(
                await hardhatStaking.hasRole(treasuryRole, addr1.address)
            ).to.be.false;
        });


        it("No other account should be able to revoke the current minter and pauser", async function () {
            await expect(
                hardhatStaking
                    .connect(addrs[0])
                    .revokeRole(treasuryRole, addr1.address)
            ).to.be.revertedWith(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addrs[0].address.toLowerCase()} is missing role ${defaultAdmin}`);
        });

        it("Default admin should be able to renounce defaultAdmin role", async function () {
            await hardhatStaking.revokeRole(defaultAdmin, owner.address);
            expect(
                await hardhatStaking.hasRole(defaultAdmin, owner.address)
            ).to.be.false;
        });

        it("Should fail if any other account tried to renounce defaultAdmin", async function () {
            await expect(
                hardhatStaking.connect(addr1).revokeRole(defaultAdmin, owner.address)
            ).to.be.revertedWith(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addr1.address.toLowerCase()} is missing role ${defaultAdmin}'`);
        });
    });

    describe("Fees Related", function() {
        it("TreasuryRole address should be able to change the treasury address",  async function (){
            await hardhatStaking.connect(addr1).changeTreasuryAddress(addr3.address);

            expect(
                await hardhatStaking.treasury()
            ).to.be.equal(addr3.address);
        });

        it("Any other address shouldn't be able to change the treasury address",  async function (){
            await expect(
                hardhatStaking.changeTreasuryAddress(addr3.address)
            ).to.be.revertedWith(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${owner.address.toLowerCase()} is missing role ${treasuryRole}'`);
        });


        it("TreasuryRole address should be able to call the function to collect fees",  async function (){
            const totalFees = await hardhatStaking.feesCollected();
            await hardhatStaking.connect(addr1).collectFees();

            expect(
                await hardhatUSDC.balanceOf(addr3.address)
            ).to.be.equal(totalFees);
        });

        it("TreasuryRole address shouldn't be able to change treasury address to 0 address",  async function (){
            await expect(
                hardhatStaking.connect(addr1).changeTreasuryAddress('0x0000000000000000000000000000000000000000')
            ).to.be.revertedWith("Non zero address required");
        });

        it("Any other address shouldn't be able to call the function to collect fees",  async function (){
            await expect(
                hardhatStaking.collectFees()
            ).to.be.revertedWith(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${owner.address.toLowerCase()} is missing role ${treasuryRole}'`);
        });
    })
});
