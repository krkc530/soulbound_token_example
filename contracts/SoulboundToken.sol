// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./interfaces/IERC5192.sol";
import "./interfaces/IERC5484.sol";

abstract contract SouldBoundToken is
    ERC721,
    ERC721URIStorage,
    IERC5192,
    IERC5484
{
    mapping(uint256 => bool) private _isLocked;
    mapping(uint256 => BurnAuth) private _burnAuth;
    mapping(uint256 => address) private _tokenIssuers;

    error ErrLocked();
    error ErrNotFound();

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function _issue(
        address to,
        uint256 tokenId,
        bool isLocked,
        BurnAuth burnAuth
    ) internal {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, "");

        // remember is the token is locked
        _isLocked[tokenId] = isLocked;
        // remember the `burnAuth` for this token
        _burnAuth[tokenId] = burnAuth;
        // remember the issuer and owner of the token
        _tokenIssuers[tokenId] = msg.sender;

        emit Issued(msg.sender, to, tokenId, burnAuth);
    }

    function locked(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) revert ErrNotFound();
        return _isLocked[tokenId];
    }

    function burnAuth(uint256 tokenId) external view returns (BurnAuth) {
        return _burnAuth[tokenId];
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        address issuer = _tokenIssuers[tokenId];
        address owner = ownerOf(tokenId);
        BurnAuth burnAuth = _burnAuth[tokenId];

        require(
            (burnAuth == BurnAuth.Both &&
                (msg.sender == issuer || msg.sender == owner)) ||
                (burnAuth == BurnAuth.IssuerOnly && msg.sender == issuer) ||
                (burnAuth == BurnAuth.OwnerOnly && msg.sender == owner),
            "The set burnAuth doesn't allow you to burn this token"
        );

        // Burn the token
        delete _tokenIssuers[tokenId];
        delete _isLocked[tokenId];
        delete _burnAuth[tokenId];
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        if (_isLocked[tokenId]) revert ErrLocked();
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
