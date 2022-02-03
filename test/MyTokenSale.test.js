const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale_0", async function(accounts) {
    const [ deployerAccount, recipient, anotherAccount ] = accounts;

    it("all coins should be in the tokensale smart contract", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf.call(TokenSale.address);
        console.log("balance: "+balance)
        let totalSupply = await instance.totalSupply.call();
        console.log("totalSupply: "+totalSupply)
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

});

contract("TokenSale_1", async function(accounts) {
    const [ deployerAccount, recipient, anotherAccount ] = accounts;

    it("should be possible to buy one token by simply sending ether to the smart contract", async () => {

        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);

        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.rejected;
        await expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
    
        let kycInstance = await KycContract.deployed();
        await kycInstance.setKycCompleted(recipient);
    
        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
    
    });

});

contract("TokenSale", async function(accounts) {
    const [ deployerAccount, recipient, anotherAccount ] = accounts;

    it("there shouldnt be any coins in my account", async () => {
        let instance = await Token.deployed();
        expect(instance.balanceOf.call(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("should be possible to buy a token", async () =>{
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        expect(tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "wei") })).to.be.fulfilled;
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(balanceBefore));
    });

});