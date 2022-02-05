const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");
var MintedCrowdsale = artifacts.require("./MintedCrowdsale.sol");
var ERC20Mintable = artifacts.require("./ERC20Mintable.sol");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale_0", async function(accounts) {
    const [ deployerAccount, recipient, anotherAccount ] = accounts;

    it("all coins should be in the tokensale smart contract", async () => {
        let instance = await ERC20Mintable.deployed();
        let balance = await instance.balanceOf.call(MintedCrowdsale.address);
        console.log("balance: "+balance)
        let totalSupply = await instance.totalSupply.call();
        console.log("totalSupply: " + totalSupply)
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

});

contract("TokenSale_1", async function(accounts) {
    const [ deployerAccount, recipient, anotherAccount ] = accounts;

    const rate = new BN('1');

    // beforeEach(async function () {
    //     // this.kycContract = await KycContract.deployed()
    //     this.token = await ERC20Mintable.new({ from: deployerAccount });
    //     this.crowdsale = await MintedCrowdsale.new(rate, deployerAccount, this.token.address);
    
    //     // add the MintedCrowdsale as a minter
    //     await this.token.addMinter(this.crowdsale.address);
    //   });

    it("should be possible to buy one token by simply sending ether to the smart contract", async () => {

        let tokenInstance = await ERC20Mintable.deployed();
        let tokenSaleInstance = await MintedCrowdsale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);

        console.log("balanceBeforeAccount: " + balanceBeforeAccount)

        expect(balanceBeforeAccount).to.be.bignumber.equal(new BN('0'));

        await expect(tokenSaleInstance.buyTokens({from: recipient, value: web3.utils.toWei("10", "wei")})).to.be.rejected;

        let isMinter = await tokenInstance.isMinter(tokenSaleInstance.address);
        expect(isMinter).to.be.true;
        console.log("isMinter: " + isMinter);


    
    });

});

// contract("TokenSale", async function(accounts) {
//     const [ deployerAccount, recipient, anotherAccount ] = accounts;

//     it("there shouldnt be any coins in my account", async () => {
//         let instance = await Token.deployed();
//         expect(instance.balanceOf.call(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
//     });

//     it("should be possible to buy a token", async () =>{
//         let tokenInstance = await Token.deployed();
//         let tokenSaleInstance = await TokenSale.deployed();
//         let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
//         expect(tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled;
//         return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(balanceBefore));
//     });

// });