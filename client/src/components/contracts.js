import { ChainId } from "@usedapp/core";

import StakerArtifact from "../artifacts/contracts/StakingContract.sol/StakingContract.json"
import USDCArtifact from "../artifacts/contracts/USDC.sol/USDC.json";

const usdcAddresses = {
  [ChainId.Rinkeby]: "0x62f46d44751072626601ECC093b213ab9D5B2084",
};

const stakerAddresses = {
  [ChainId.Rinkeby]: "0x38eF96b4F855090CCC0129386aF50B469e1C1218",
};

let USDC = {
  abi: USDCArtifact.abi,
  address: usdcAddresses[ChainId.Rinkeby],
};

let Staker = {
  abi: StakerArtifact.abi,
  address: stakerAddresses[ChainId.Rinkeby],
};

export {USDC, Staker};