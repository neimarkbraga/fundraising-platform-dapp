let contractBuild = require('../../../smart-contracts/build/contracts/FundraisingPlatform');
let contractAbi = contractBuild.abi;
let contractAddress = contractBuild.networks["5777"].address;
let TheContract = null;
if(web3) TheContract = web3.eth.contract(contractAbi).at(contractAddress);
export default TheContract;