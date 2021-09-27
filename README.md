## USDC-Demo
----
## Contracts
### 1. USDC

    An ERC-20 token with 6 decimal places, the contract can be Paused and new coins can minted by the owner of the contract.

### 2. Staking Cntract

    A contract that allows users to stake ERC-20 tokens for a fee of 0.02%. Unstaking is allowed only after atleast 2 hours of staking.

### 3. Ownable

    A contract that allows special access to certain functions in an inherited smart-contract.

### 4. Mintable

    An abstract contract that declares the function which allows minting of new coins.

### 5. Pausable 

    A contract which makes it possible to pause/unpause all the functions in a smart-contract.

### 6.  IERC20

    An interface contract that declares all the functions which are implemented by the USDC contract.

### 7.  SafeERC20

    An Open-Zeppelin library that checks if the ERC20 functions are executed without any errors.

### 8.  Address

    An Open-Zeppelin library that provides various functions to handle addresses in a smart-contract

## Testing
```
npx hardhat test
```


## Scripts

1. Deploy Script
```
npx hardhat run --network goerli scripts/deploy.js
```

2. Mint Script
```
npx hardhat run --network goerli scripts/mint.js
```


### Deployed Contracts
1. USDC: [0xe4d0aFC3F9AC160633243beADCbf2E2b2f0a567C](https://goerli.etherscan.io/address/0xe4d0aFC3F9AC160633243beADCbf2E2b2f0a567C)
2. Staking: [0x7C5171C1a7c0C0b326580ce86f43c4e490a2Fbb5](https://goerli.etherscan.io/address/0x7C5171C1a7c0C0b326580ce86f43c4e490a2Fbb5)