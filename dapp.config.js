let contractBuild = require('./smart-contracts/build/contracts/FundraisingPlatform');
module.exports = {
    serverSideURL: 'http://localhost:86',
    web3HttpProvider: 'http://localhost:8545',
    contractAddress: contractBuild.networks["5777"].address,
    contractABI: contractBuild.abi
};