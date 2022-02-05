const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");
var MintedCrowdsale = artifacts.require("./MintedCrowdsale.sol");
var ERC20Mintable = artifacts.require("./ERC20Mintable.sol");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("MintedCrowdsale_0", async function(accounts) {
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

contract("MintedCrowdsale_1", async function(accounts) {
    const [ deployerAccount, recipient, anotherAccount ] = accounts;

    const rate = new BN('1');

    it("should be possible to buy one token by simply sending ether to the smart contract", async () => {

        let tokenInstance = await ERC20Mintable.deployed();
        let tokenSaleInstance = await MintedCrowdsale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);

        console.log("balanceBeforeAccount: " + balanceBeforeAccount)

        expect(balanceBeforeAccount).to.be.bignumber.equal(new BN('0'));

        let oldBalanceOfRecipient = await tokenInstance.balanceOf(recipient);
        console.log("oldBalanceOfRecipient: " + oldBalanceOfRecipient);

        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("10", "wei")})).to.be.fulfilled;

        let isMinter = await tokenInstance.isMinter(tokenSaleInstance.address);
        expect(isMinter).to.be.true;
        console.log("isMinter: " + isMinter);

        let newBalanceOfRecipient = await tokenInstance.balanceOf(recipient);
        console.log("newBalanceOfRecipient: " + newBalanceOfRecipient);

        expect(newBalanceOfRecipient).to.be.bignumber.equal(oldBalanceOfRecipient + 10);

    });

});