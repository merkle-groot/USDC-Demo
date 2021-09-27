const {expect} = require("chai");

describe("USDC Contract", function(){
    let USDC;
    let hardhatUSDC;
    let owner;
    let addr1;
    let addr2;
    let addrs;


    beforeEach(async function(){

        USDC = await ethers.getContractFactory("USDC");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        hardhatUSDC = await USDC.deploy(2.7*10**13);

    });

    describe("Deployment", function(){

        it("Should set the right owner", async function(){

            expect(await hardhatUSDC.owner()).to.equal(owner.address);

        });

        it("Should assign total supply of tokens to the owner", async function(){

            const ownerBalance = await hardhatUSDC.balanceOf(owner.address);
            expect(await hardhatUSDC.totalSupply()).to.equal(ownerBalance);

        });

    });

    describe("Transactions", function(){
        it("Should be able to send tokens between accounts", async function(){

            await hardhatUSDC.transfer(addr1.address, 1000*10**6);
            const addr1Balance = await hardhatUSDC.balanceOf(addr1.address);
            const ownerBalance = await hardhatUSDC.balanceOf(owner.address);
            expect(addr1Balance).to.equal(1000*10**6);
            expect(ownerBalance).to.equal(2.7*10**13 - 1000*10**6);

            await hardhatUSDC.connect(addr1).transfer(addr2.address, 600*10**6);
            const newAddr1Balance = await hardhatUSDC.balanceOf(addr1.address);
            const addr2Balance = await hardhatUSDC.balanceOf(addr2.address);
            expect(newAddr1Balance).to.equal(400*10**6);
            expect(addr2Balance).to.equal(600*10**6);

        });

        it("Should fail if sender doesn't have enough balance", async function(){

            await expect(hardhatUSDC.connect(addr1).transfer(addr1.address,1000*10**6)).to.be.revertedWith("Insufficient Balance");

            await hardhatUSDC.transfer(addr1.address, 1000*10**6);
            await expect(hardhatUSDC.connect(addr1).transfer(addr2.address, 1001*10**6)).to.be.revertedWith("Insufficient Balance");
        
        });

        it("Should be able to approve USDC to another account", async function(){
            
            await hardhatUSDC.approve(addr1.address, 1000*10**6);

            const approvedValue = await hardhatUSDC.allowance(owner.address, addr1.address);
            expect(approvedValue).to.be.equal(1000*10**6);
        });

        it("Should be able to spend the approved USDC", async function(){
            
            await hardhatUSDC.approve(addr1.address, 1000*10**6);

            const approvedValue = await hardhatUSDC.allowance(owner.address, addr1.address);
            expect(approvedValue).to.be.equal(1000*10**6);

            await hardhatUSDC.connect(addr1).transferFrom(owner.address, addr2.address, 1000*10**6);
            const addr1Balance = await hardhatUSDC.balanceOf(addr1.address);
            const addr2Balance = await hardhatUSDC.balanceOf(addr2.address);
            const ownerBalance = await hardhatUSDC.balanceOf(owner.address);

            expect(addr1Balance).to.be.equal(0);
            expect(addr2Balance).to.be.equal(1000*10**6);
            expect(ownerBalance).to.be.equal(parseInt(await hardhatUSDC.totalSupply())-1000*10**6);

        });

        it("Should fail if tried to spend more than the approved amount", async function(){
            
            await hardhatUSDC.approve(addr1.address, 1000*10**6);

            const approvedValue = await hardhatUSDC.allowance(owner.address, addr1.address);
            expect(approvedValue).to.be.equal(1000*10**6);

            await expect(hardhatUSDC.connect(addr1).transferFrom(owner.address, addr2.address, 1001*10**6)).to.be.revertedWith("Unapproved tx");

        });



    });

    describe("Ownership", function(){

        it("Should be able to transfer ownership", async function(){

            await hardhatUSDC.changeOwner(addr1.address);
            const currentOwner = await hardhatUSDC.returnOwner();
            expect(currentOwner).to.equal(addr1.address);

        });

        it("Should fail if any other account tried to transfer ownership", async function(){

            await expect(hardhatUSDC.connect(addr1).changeOwner(addr1.address)).to.be.revertedWith("Unauthorized Access");
            await expect(hardhatUSDC.connect(addr1).changeOwner(addr2.address)).to.be.revertedWith("Unauthorized Access");

        });

        it("Should be able to renounce ownership", async function(){
            
            await hardhatUSDC.renounceOwnership();
            const currentOwner = await hardhatUSDC.returnOwner();
            expect(currentOwner).to.equal('0x0000000000000000000000000000000000000000');

        });

        it("Should fail if any other account tried to renounce ownership", async function(){
            
            await expect(hardhatUSDC.connect(addr1).renounceOwnership()).to.be.revertedWith("Unauthorized Access");

        });

    });

    describe("Pausable", function(){

        it("Should be able to pausse txs", async function(){
            await hardhatUSDC.pause();
            await expect(hardhatUSDC.transfer(addr1.address, 1000*10**6)).to.be.revertedWith("SC is Paused");

        });

        it("Should fail if any other account tried to pause txs", async function(){
            await expect(hardhatUSDC.connect(addr1).pause()).to.be.revertedWith("Unauthorized Access");
        });

        it("Should be able to unpause the txs", async function(){

            await hardhatUSDC.pause();
            await expect(hardhatUSDC.transfer(addr1.address, 1000*10**6)).to.be.revertedWith("SC is Paused");
            
            await hardhatUSDC.unPause();
            await hardhatUSDC.transfer(addr1.address,1000*10**6);
            const addr1Balance = await hardhatUSDC.balanceOf(addr1.address);
            expect(addr1Balance).to.be.equal(1000*10**6);

        });
        
        it("Should fail if any other account tried to unpause the txs", async function(){
            await hardhatUSDC.pause();
            await expect(hardhatUSDC.transfer(addr1.address, 1000*10**6)).to.be.revertedWith("SC is Paused");

            await expect(hardhatUSDC.connect(addr1).unPause()).to.be.revertedWith("Unauthorized Access");

        });

    });

    describe("Mintable", function(){
        it("Should be able to mint more USDC into existence", async function(){
            const totalSupply = await hardhatUSDC.totalSupply();
            await hardhatUSDC.mintCoins(owner.address, 1000*10**6);
            const newTotalSupply = await hardhatUSDC.totalSupply();

            expect(newTotalSupply).to.be.equal(parseInt(totalSupply)+1000*10**6);
            expect(await hardhatUSDC.balanceOf(owner.address)).to.be.equal(newTotalSupply);
        });

        it("Should fail if any other account tried to mint USDC into existence", async function(){
            await expect(hardhatUSDC.connect(addr1).mintCoins(owner.address, 1000)).to.be.revertedWith("Unauthorized Access");
        });

    });



});