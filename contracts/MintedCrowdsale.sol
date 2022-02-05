// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "./Crowdsale.sol";
// import "./KycContract.sol";
import "./ERC20Mintable.sol";

/**
 * @title MintedCrowdsale
 * @dev Extension of Crowdsale contract whose tokens are minted in each purchase.
 * Token ownership should be transferred to MintedCrowdsale for minting.
 */
contract MintedCrowdsale is Crowdsale {

    // KycContract kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        ERC20Mintable token
        // ,KycContract _kyc
    )
        Crowdsale(rate, wallet, token)
        public
    {
        // kyc = _kyc;

    }

    /**
     * @dev Overrides delivery by minting tokens upon purchase.
     * @param beneficiary Token purchaser
     * @param tokenAmount Number of tokens to be minted
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal override{
        // require(kyc.kycCompleted(msg.sender), "KYC Not completed, purchase not allowed");
        // Potentially dangerous assumption about the type of the token.
        require(
            ERC20Mintable(address(token())).mint(beneficiary, tokenAmount),
                "MintedCrowdsale: minting failed"
        );
    }
}