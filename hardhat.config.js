/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("solidity-coverage");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: process.env.goerliURL,
      chainId: 5,
      accounts: [
        process.env.privateKey1,
        process.env.privateKey2,
        process.env.privateKey3,
      ],
    },
  },
  paths: {
    artifacts: "./client/src/artifacts",
  },
};
