import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import ERC20Mintable from "./contracts/ERC20Mintable.json";
import KycContract from "./contracts/KycContract.json";
import MintedCrowdsale from "./contracts/MintedCrowdsale.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    loaded: false, 
    kycAddress: "0x123", 
    tokenSaleAddress: "", 
    userTokens: 0, 
    tokenSymbol: "-",
    totalSupply: 0
  };

  componentDidMount = async () => {
    try {
        // Get network provider and web3 instance.
        this.web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        this.accounts = await this.web3.eth.getAccounts();

        //alert(this.accounts[0])

        // Get the contract instance.
        //this.networkId = await this.web3.eth.net.getId(); //<<- this doesn't work with MetaMask anymore
        this.networkId = await this.web3.eth.getChainId();    

        this.myToken = new this.web3.eth.Contract(
          MyToken.abi,
          MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
        );

        this.myMintableToken = new this.web3.eth.Contract(
          ERC20Mintable.abi,
          ERC20Mintable.networks[this.networkId] && ERC20Mintable.networks[this.networkId].address,
        );

        this.myTokenSale = new this.web3.eth.Contract(
          MyTokenSale.abi,
          MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
        );

        this.mintedCrowdsale = new this.web3.eth.Contract(
          MintedCrowdsale.abi,
          MintedCrowdsale.networks[this.networkId] && MintedCrowdsale.networks[this.networkId].address,
        );

        this.kycContract = new this.web3.eth.Contract(
          KycContract.abi,
          KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
        );

        // let symbol = await this.myToken.methods.symbol().call()
        let symbol = await this.myMintableToken.methods.symbol().call()

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.listenToTokenTransfer();
        this.setState({ loaded:true, tokenSaleAddress: this.mintedCrowdsale._address, tokenSymbol: symbol }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleBuyToken = async () => {
    await this.mintedCrowdsale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1", "wei")});
  }

  updateUserTokens = async() => {
    // let userTokens = await this.myToken.methods.balanceOf(this.accounts[0]).call();
    // let totSuppl = await this.myToken.methods.totalSupply().call();

    let userTokens = await this.myMintableToken.methods.balanceOf(this.accounts[0]).call();
    let totSuppl = await this.myMintableToken.methods.totalSupply().call();
    this.setState({userTokens: userTokens, totalSupply: totSuppl});
  }

  listenToTokenTransfer = async() => {
    // this.myToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
    this.myMintableToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleKycSubmit = async () => {
    await this.kycContract.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    alert("Account " + this.state.kycAddress + " is now whitelisted");
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Carmelo Iriti Token</h1>

        {/* <h2>Enable your account</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelist</button> */}
        <h2>Buy CFIM</h2>
        <p>Send Ether to this address: {this.state.tokenSaleAddress}</p>
        <p>You have: {this.state.userTokens} {this.state.tokenSymbol}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy 1 token more</button>
        <p>Total supply: {this.state.totalSupply}</p>
      </div>
    );
  }
}

export default App;
