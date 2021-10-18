import { ChainId } from "@usedapp/core";

// import ProxyContract from "../artifacts/contracts/ProxyContract.sol/ProxyContract.json";
import StakerArtifact from "../artifacts/contracts/StakingContractV2.sol/StakingContractV2.json"
import USDCArtifact from "../artifacts/contracts/USDC.sol/USDC.json";

const usdcAddresses = {
  [ChainId.Rinkeby]: "0x62f46d44751072626601ECC093b213ab9D5B2084",
};

const stakerAddresses = {
  [ChainId.Rinkeby]: "0xd290543c298b8203e1fe6f69cb17f512d1d70958",
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