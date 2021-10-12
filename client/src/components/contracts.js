import { ChainId } from "@usedapp/core";

import StakerArtifact from "../artifacts/contracts/StakingContract.sol/StakingContract.json"
import USDCArtifact from "../artifacts/contracts/USDC.sol/USDC.json";

const usdcAddresses = {
  [ChainId.Hardhat]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

const stakerAddresses = {
  [ChainId.Hardhat]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
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