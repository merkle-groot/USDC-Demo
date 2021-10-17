import { ChainId } from "@usedapp/core";

import StakerArtifact from "../artifacts/contracts/StakingContract.sol/StakingContract.json"
import USDCArtifact from "../artifacts/contracts/USDC.sol/USDC.json";

const usdcAddresses = {
  [ChainId.Goerli]: "0xd34B958820C1F0042A6615aF9d532F578Bb98013",
};

const stakerAddresses = {
  [ChainId.Goerli]: "0x617DBeC08f1EC03DC662190e34888692Ee38b3Bb",
};

let USDC = {
  abi: USDCArtifact.abi,
  address: usdcAddresses[ChainId.Goerli],
};

let Staker = {
  abi: StakerArtifact.abi,
  address: stakerAddresses[ChainId.Goerli],
};

export {USDC, Staker};