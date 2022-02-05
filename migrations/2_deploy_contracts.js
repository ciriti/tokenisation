
var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSales = artifacts.require("./MyTokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");
var ERC20Mintable = artifacts.require("./ERC20Mintable.sol");
var MintedCrowdsale = artifacts.require("./MintedCrowdsale.sol");
var MinterRole = artifacts.require("./MinterRole.sol");
require("dotenv").config({ path: "../.env" })


// module.exports = async function(deployer) {
//   let addr = await web3.eth.getAccounts();
//   await deployer.deploy(MyToken, 1000000000);
//   await deployer.deploy(MyTokenSales, 1, addr[0], MyToken.address, KycContract.address);
//   let tokenInstance = await MyToken.deployed();
//   await tokenInstance.transfer(MyTokenSales.address, 1000000000);
// };


module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  // await deployer.deploy(KycContract, addr[0]);
  await deployer.deploy(ERC20Mintable);
  await deployer.deploy(MintedCrowdsale, 1, addr[0], ERC20Mintable.address);
  
  let mintableToken = await ERC20Mintable.deployed();
  await mintableToken.addMinter(MintedCrowdsale.address);
};