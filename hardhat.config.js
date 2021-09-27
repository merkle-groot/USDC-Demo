/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  	solidity: "0.8.0",
  	networks:{
		goerli:{
			url: process.env.goerliURL,
			chainId: 5,
			accounts:  [process.env.privateKey1, process.env.privateKey2],
		}
  	},
};
