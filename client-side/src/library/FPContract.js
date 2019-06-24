let dappConfig = require('../../../dapp.config');
let TheContract = null;
let web3 = window.web3 || web3;
if(web3) TheContract = web3.eth.contract(dappConfig.contractABI).at(dappConfig.contractAddress);
export default TheContract;