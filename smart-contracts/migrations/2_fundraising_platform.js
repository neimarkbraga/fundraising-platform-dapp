const FundraisingPlatform = artifacts.require("FundraisingPlatform");

module.exports = function(deployer) {
  deployer.deploy(FundraisingPlatform);
};