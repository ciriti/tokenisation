
var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSales = artifacts.require("./MyTokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");
// var ERC20Mintable = artifacts.require("./ERC20Mintable.sol");
// var MintedCrowdsale = artifacts.require("./MintedCrowdsale.sol");
// var MinterRole = artifacts.require("./MinterRole.sol");
require("dotenv").config({ path: "../.env" })


// module.exports = function(deployer) {
//   let addr = await web3.eth.getAccounts();
//   deployer.deploy(MyToken, 1000000000);
//   deployer.deploy(MyTokenSales, 1, addr[0], MyToken.address);
//   let tokenInstance = await MyToken.deployed();
//   tokenInstance.transfer(MyTokenSales.address, 1000000000);
// };


module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, process.env.INIT_TOKENS);
  await deployer.deploy(KycContract);
  // await deployer.deploy(ERC20Mintable);
  // await deployer.deploy(MintedCrowdsale);
  // await deployer.deploy(MinterRole);
  await deployer.deploy(MyTokenSales, 1, addr[0], MyToken.address, KycContract.address);
  let tokenInstance = await MyToken.deployed();
  await tokenInstance.transfer(MyTokenSales.address, process.env.INIT_TOKENS);
};