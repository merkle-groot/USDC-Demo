import { ChainId } from "@usedapp/core";

import StakerArtifact from "../artifacts/contracts/StakingContract.sol/StakingContract.json"
import USDCArtifact from "../artifacts/contracts/USDC.sol/USDC.json";

const usdcAddresses = {
  [ChainId.Hardhat]: "0x8464135c8F25Da09e49BC8782676a84730C318bC",
};

const stakerAddresses = {
  [ChainId.Hardhat]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

let USDC = {
  abi: USDCArtifact.abi,
  address: usdcAddresses[ChainId.Hardhat],
};

let Staker = {
  abi: StakerArtifact.abi,
  address: stakerAddresses[ChainId.Hardhat],
};

export {USDC, Staker};