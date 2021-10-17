const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getOriginalNode } = require("typescript");

describe("USDC Contract", function () {
  let USDC;
  let hardhatUSDC;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let defaultAdmin;
  let minterRole;
  let pauserRole;

  beforeEach(async function () {
    USDC = await ethers.getContractFactory("USDC");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatUSDC = await USDC.deploy(
      2.1 * 10 ** 7,
      addr1.address,
      addr2.address
    );
    defaultAdmin = await hardhatUSDC.DEFAULT_ADMIN_ROLE();
    minterRole = await hardhatUSDC.MINTER_ROLE();
    pauserRole = await hardhatUSDC.PAUSER_ROLE();
  });

  describe("Deployment", function () {
    it("Should set the right default admin", async function () {
      expect(await hardhatUSDC.hasRole(defaultAdmin, owner.address)).to.be.true;
    });

    it("Should set the right address as the pauser role", async function () {
      expect(await hardhatUSDC.hasRole(pauserRole, addr1.address)).to.be.true;
    });

    it("Should set the right address as the minter role", async function () {
      expect(await hardhatUSDC.hasRole(minterRole, addr2.address)).to.be.true;
    });

    it("Should assign total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatUSDC.balanceOf(owner.address);
      expect(await hardhatUSDC.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should be able to send tokens between accounts", async function () {
      await hardhatUSDC.transfer(addr1.address, 1000 * 10 ** 6);
      const addr1Balance = await hardhatUSDC.balanceOf(addr1.address);
      const ownerBalance = await hardhatUSDC.balanceOf(owner.address);
      expect(addr1Balance).to.equal(1000 * 10 ** 6);
      expect(ownerBalance).to.equal(2.1 * 10 ** 13 - 1000 * 10 ** 6);

      await hardhatUSDC.connect(addr1).transfer(addr2.address, 600 * 10 ** 6);
      const newAddr1Balance = await hardhatUSDC.balanceOf(addr1.address);
      const addr2Balance = await hardhatUSDC.balanceOf(addr2.address);
      expect(newAddr1Balance).to.equal(400 * 10 ** 6);
      expect(addr2Balance).to.equal(600 * 10 ** 6);
    });

    it("Should fail if sender doesn't have enough balance", async function () {
      await expect(
        hardhatUSDC.connect(addr1).transfer(addr1.address, 1000 * 10 ** 6)
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'"
      );

      await hardhatUSDC.transfer(addr1.address, 1000 * 10 ** 6);
      await expect(
        hardhatUSDC.connect(addr1).transfer(addr2.address, 1001 * 10 ** 6)
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'"
      );
    });

    it("Should be able to approve USDC to another account", async function () {
      await hardhatUSDC.approve(addr1.address, 1000 * 10 ** 6);

      const approvedValue = await hardhatUSDC.allowance(
        owner.address,
        addr1.address
      );
      expect(approvedValue).to.be.equal(1000 * 10 ** 6);
    });

    it("Should be able to spend the approved USDC", async function () {
      await hardhatUSDC.approve(addr1.address, 1000 * 10 ** 6);

      const approvedValue = await hardhatUSDC.allowance(
        owner.address,
        addr1.address
      );
      expect(approvedValue).to.be.equal(1000 * 10 ** 6);

      await hardhatUSDC
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, 1000 * 10 ** 6);
      const addr1Balance = await hardhatUSDC.balanceOf(addr1.address);
      const addr2Balance = await hardhatUSDC.balanceOf(addr2.address);
      const ownerBalance = await hardhatUSDC.balanceOf(owner.address);

      expect(addr1Balance).to.be.equal(0);
      expect(addr2Balance).to.be.equal(1000 * 10 ** 6);
      expect(ownerBalance).to.be.equal(
        parseInt(await hardhatUSDC.totalSupply()) - 1000 * 10 ** 6
      );
    });

    it("Should fail if tried to spend more than the approved amount", async function () {
      await hardhatUSDC.approve(addr1.address, 1000 * 10 ** 6);

      const approvedValue = await hardhatUSDC.allowance(
        owner.address,
        addr1.address
      );
      expect(approvedValue).to.be.equal(1000 * 10 ** 6);

      await expect(
        hardhatUSDC
          .connect(addr1)
          .transferFrom(owner.address, addr2.address, 1001 * 10 ** 6)
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds allowance'"
      );
    });
  });

  describe("Access Roles", function () {
    it("Admin of Minter and Pauser must be the default admin", async function () {
      await expect(await hardhatUSDC.getRoleAdmin(minterRole)).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      await expect(await hardhatUSDC.getRoleAdmin(pauserRole)).to.be.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    });

    it("Default Admin should be able to grant new minter and pauser", async function () {
      await hardhatUSDC.grantRole(minterRole, addrs[0].address);

      expect(await hardhatUSDC.hasRole(minterRole, addrs[0].address)).to.be
        .true;
    });

    it("No other account should be able to grant new minter and pauser", async function () {
      await expect(
        hardhatUSDC.connect(addrs[0]).grantRole(minterRole, addrs[0].address)
      ).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addrs[0].address.toLowerCase()} is missing role ${defaultAdmin}`
      );

      await expect(
        hardhatUSDC.connect(addrs[0]).grantRole(pauserRole, addrs[0].address)
      ).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addrs[0].address.toLowerCase()} is missing role ${defaultAdmin}`
      );
    });

    it("Default Admin should be able to revoke the current minter and pauser", async function () {
      await hardhatUSDC.revokeRole(minterRole, addr2.address);

      expect(await hardhatUSDC.hasRole(minterRole, addr2.address)).to.be.false;

      await hardhatUSDC.revokeRole(pauserRole, addr1.address);

      expect(await hardhatUSDC.hasRole(pauserRole, addr1.address)).to.be.false;
    });

    it("No other account should be able to revoke the current minter and pauser", async function () {
      await expect(
        hardhatUSDC.connect(addrs[0]).revokeRole(minterRole, addr2.address)
      ).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addrs[0].address.toLowerCase()} is missing role ${defaultAdmin}`
      );

      await expect(
        hardhatUSDC.connect(addrs[0]).revokeRole(pauserRole, addr1.address)
      ).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addrs[0].address.toLowerCase()} is missing role ${defaultAdmin}`
      );
    });

    it("Default admin should be able to renounce defaultAdmin role", async function () {
      await hardhatUSDC.revokeRole(defaultAdmin, owner.address);
      expect(await hardhatUSDC.hasRole(defaultAdmin, owner.address)).to.be
        .false;
    });

    it("Should fail if any other account tried to renounce defaultAdmin", async function () {
      await expect(
        hardhatUSDC.connect(addr1).revokeRole(defaultAdmin, owner.address)
      ).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addr1.address.toLowerCase()} is missing role ${defaultAdmin}'`
      );
    });
  });

  describe("Pausable", function () {
    it("PauserRole should be able to pause txs", async function () {
      await hardhatUSDC.connect(addr1).pause();
      await expect(
        hardhatUSDC.transfer(addr1.address, 1000 * 10 ** 6)
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'Pausable: paused'"
      );
    });

    it("Should fail if any other account tried to pause txs", async function () {
      await expect(hardhatUSDC.connect(addr2).pause()).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addr2.address.toLowerCase()} is missing role ${pauserRole}'`
      );
    });

    it("Should be able to unpause the txs", async function () {
      await hardhatUSDC.connect(addr1).pause();
      await expect(
        hardhatUSDC.transfer(addr1.address, 1000 * 10 ** 6)
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'Pausable: paused'"
      );

      await hardhatUSDC.connect(addr1).unpause();
      await hardhatUSDC.transfer(addr1.address, 1000 * 10 ** 6);
      const addr1Balance = await hardhatUSDC.balanceOf(addr1.address);
      expect(addr1Balance).to.be.equal(1000 * 10 ** 6);
    });

    it("Should fail if any other account tried to unpause the txs", async function () {
      await hardhatUSDC.connect(addr1).pause();
      await expect(
        hardhatUSDC.transfer(addr1.address, 1000 * 10 ** 6)
      ).to.be.revertedWith(
        "VM Exception while processing transaction: reverted with reason string 'Pausable: paused'"
      );

      await expect(hardhatUSDC.connect(addr2).unpause()).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addr2.address.toLowerCase()} is missing role ${pauserRole}'`
      );
    });
  });

  describe("Mintable", function () {
    it("MinterRole should be able to mint more USDC into existence", async function () {
      const totalSupply = await hardhatUSDC.totalSupply();
      await hardhatUSDC.connect(addr2).mintCoins(addr1.address, 1000 * 10 ** 6);
      const newTotalSupply = await hardhatUSDC.totalSupply();

      expect(newTotalSupply).to.be.equal(
        parseInt(totalSupply) + 1000 * 10 ** 6
      );
      expect(await hardhatUSDC.balanceOf(addr1.address)).to.be.equal(
        1000 * 10 ** 6
      );
    });

    it("Anyone should be able to mint 1000 USDC into existence", async function () {
      const totalSupply = await hardhatUSDC.totalSupply();
      await hardhatUSDC.connect(addrs[1]).testMint(addrs[1].address);
      const newTotalSupply = await hardhatUSDC.totalSupply();

      expect(newTotalSupply).to.be.equal(
        parseInt(totalSupply) + 1000 * 10 ** 6
      );
      expect(await hardhatUSDC.balanceOf(addrs[1].address)).to.be.equal(
        1000 * 10 ** 6
      );
    });

    it("Should fail if any other account tried to mint USDC into existence", async function () {
      await expect(
        hardhatUSDC.connect(addr1).mintCoins(owner.address, 1000)
      ).to.be.revertedWith(
        `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${addr1.address.toLowerCase()} is missing role ${minterRole}'`
      );
    });
  });
});
