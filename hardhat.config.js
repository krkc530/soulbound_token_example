require("@nomicfoundation/hardhat-chai-matchers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "testrpc",
  networks: {
    testrpc: {
      url: "http://localhost:8545",
      gas: 10000000,
      // gasPrice: 0,
    },
  },
};
