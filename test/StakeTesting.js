const {expect} = require("chai");

describe("Staking", function(){
    let USDC;
    let hardhatUSDC;
    let Staking;
    let hardhatStaking;

    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

    beforeEach(async function(){

        USDC = await ethers.getContractFactory("USDC");
        Staking = await ethers.getContractFactory("StakingContract");

        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        hardhatUSDC = await USDC.deploy(2.7*10**13);
        hardhatStaking = await Staking.deploy(hardhatUSDC.address, addr3.address);

        await hardhatUSDC.transfer(addr1.address, 10000*10**6);

    });

    describe("Staking Related", function(){

        it("Should initialize the right USDC contract", async function(){

            const tokenAddress = await hardhatStaking.erc20Address();
            expect(hardhatUSDC.address).to.be.equal(tokenAddress);

        });

        it("Should be able to stake required amount of tokens", async function(){
            
            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 555*10**6);
            await hardhatStaking.connect(addr1).stake(555*10**6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89*10**6);

        });

        it("Should collect right amount of fee", async function(){

            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 1999*10**6);
            await hardhatStaking.connect(addr1).stake(1999*10**6);
            const totalFees = await hardhatStaking.feesCollected();
            expect(totalFees).to.be.equal(3.998*10**6);


            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 555*10**6);
            await hardhatStaking.connect(addr1).stake(555*10**6);
            const newTotalFees = await hardhatStaking.feesCollected();
            expect(newTotalFees).to.be.equal(5.108*10**6);

        });

        it("Should fail if tried to unstake before 2 hours", async function(){

            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 555*10**6);
            await hardhatStaking.connect(addr1).stake(555*10**6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89*10**6);

            await expect(hardhatStaking.connect(addr1).unStake(553.89*10**6)).to.be.revertedWith("Wait until unlock period");

        });
        

        it("Should be able to unstake after 2 hours", async function(){

            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 555*10**6);
            await hardhatStaking.connect(addr1).stake(555*10**6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89*10**6);

            await network.provider.send("evm_increaseTime", [7200]);
            expect(await hardhatStaking.connect(addr1).unStake(553.89*10**6));

        });

        it("Should fail if tried to unstake more than the amount that was put in even after 2 hours", async function(){

            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 555*10**6);
            await hardhatStaking.connect(addr1).stake(555*10**6);
            const stakedDeets = await hardhatStaking.staked(addr1.address);
            expect(stakedDeets.stakedAmount.toNumber()).to.be.equal(553.89*10**6);

            await network.provider.send("evm_increaseTime", [7200]);
            await expect(hardhatStaking.connect(addr1).unStake(555*10**6)).to.be.revertedWith("Cannot unstake more than the deposited amount.");

        });

    });

    describe("Owner Related", function(){

        it("Should allow the owner of the contract to withdraw funds into treasury account", async function(){

            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 1999*10**6);
            await hardhatStaking.connect(addr1).stake(1999*10**6);
            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 555*10**6);
            await hardhatStaking.connect(addr1).stake(555*10**6);

            
            const totalFees = await hardhatStaking.feesCollected();
            await hardhatStaking.collectFees();
            const addr3Balance = await hardhatUSDC.balanceOf(addr3.address);
            expect(addr3Balance).to.be.equal(totalFees);

        });

        it("Should fail if called by an account other than the owner", async function(){
            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 1999*10**6);
            await hardhatStaking.connect(addr1).stake(1999*10**6);
            await hardhatUSDC.connect(addr1).approve(hardhatStaking.address, 555*10**6);
            await hardhatStaking.connect(addr1).stake(555*10**6);

            await expect(hardhatStaking.connect(addr1).collectFees()).to.be.revertedWith("Unauthorized Access");

        });

        it("Should allow owner to change the treasury address", async function(){
            await expect(hardhatStaking.changeTreasuryAddress(addr2.address));
            const currentOwner = await hardhatStaking.treasury();

            expect(currentOwner).to.be.equal(addr2.address);
        });


        it("Should fail if called by an account other than the owner", async function(){
            await expect(hardhatStaking.connect(addr1).changeTreasuryAddress(addr2.address)).to.be.revertedWith("Unauthorized Access");
        });

    });
    
       



  


});