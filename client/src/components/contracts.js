import { ChainId } from "@usedapp/core";

import StakerArtifact from "../artifacts/contracts/StakingContract.sol/StakingContract.json";
import USDCArtifact from "../artifacts/contracts/USDC.sol/USDC.json";

const usdcAddresses = {
  [ChainId.Goerli]: "0x6eA2E8acA6F79F8aEE4c95121dd82Eef90D38B6f",
};

const stakerAddresses = {
  [ChainId.Goerli]: "0xd0452E5d93bA235D7E1B9952CFD02d2B78D8BCCE",
};

let USDC = {
  abi: USDCArtifact.abi,
  address: usdcAddresses[ChainId.Goerli],
};

let Staker = {
  abi: StakerArtifact.abi,
  address: stakerAddresses[ChainId.Goerli],
};

export { USDC, Staker };
