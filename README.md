# USDC-Demo

## Getting Started
1. Install the required node modules
```
npm install
```
2. Create a new .env file with the following fields
```
RinkebyURL="Insert your infura Rinkeby endpoint"
privateKey1="Insert a private key for the default admin account"
privateKey2="Insert a private key for the pausable/treasury admin account"
privateKey3="Insert a private key for the mintable/treasury address account"
```
3. Run the defined tests
```
npx hardhat test
```
4. Deploy the contract to Rinkeby Testnet
```
npx hardhat run --network Rinkeby scripts/deploy.js
```
5. Mint new tokens
    * Enter the current address of the USDC contract in *currUSDCAddress* variable of the mint.js file.
```
npx hardhat run --network Rinkeby scripts/mint.js
```
6. Upgrade the staking contract to V2
    * Enter the current address of the StakingContract in *currStakingAddress* variable of the upgradeTesting.js file.
```
npx hardhat run --network Rinkeby scripts/upgradeTesting.js 
```
---
## Contracts
1. USDC

    An ERC-20 token with 6 decimal places, the contract can be Paused and new coins can minted by the minterRole of the contract.

2. Staking Cntract

    A contract that allows users to stake ERC-20 tokens for a fee of 0.02%. Unstaking is allowed only after atleast 2 hours of staking.
---
## Deployed Contracts
1. USDC: [0x62f46d44751072626601ECC093b213ab9D5B2084](https://rinkeby.etherscan.io/address/0x62f46d44751072626601ECC093b213ab9D5B2084)
2. Staking: [0xd290543c298b8203e1fe6f69cb17f512d1d70958](https://rinkeby.etherscan.io/address/0xd290543c298b8203e1fe6f69cb17f512d1d70958)
---