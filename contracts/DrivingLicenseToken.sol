// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./SoulboundToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DrivingLicenseToken is SouldBoundToken, Ownable {
    constructor() SouldBoundToken("Driving License", "DRL") {}

    function issueDrivingLicense(address to, uint256 tokenId) public onlyOwner {
        _issue(to, tokenId, true, IERC5484.BurnAuth.IssuerOnly);
    }

    function getDrivingLicenseOwner(
        uint256 tokenId
    ) public view returns (address) {
        return _ownerOf(tokenId);
    }

    function burnDrivingLicense(uint256 tokenId) public {
        super._burn(tokenId);
    }
}
