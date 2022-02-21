pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Base64 } from 'base64-sol/base64.sol';

error NoTokenId();
error NoAuth();
error UpdateNotAvailable();

contract TestNFT is ERC721 {
    using Strings for uint256;

    bytes32 internal constant keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    uint256 internal constant fee = 0.1 * 10 ** 18;

    uint256 public tokenCounter = 1;

    struct Result {
        uint256 score;
        uint256 lastEmited;
        uint256 updatedCount;
    }

    mapping(uint256 => Result) public results;

    event ResultUpdated(address indexed user, uint256 score, uint256 lastUpdated, uint256 updatedCount);

    constructor() ERC721("Dynamic NFT 1", "DNFT") {}

    function emitOmikuji() external returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        requestRandomness(tokenId);
        tokenCounter = tokenId + 1;
        return tokenId;
    }

    function updateOmikuji(uint256 _tokenId) external {
        if (msg.sender != ownerOf(_tokenId)) revert NoAuth();
        if (!_exists(_tokenId)) revert NoTokenId();
        requestRandomness(_tokenId);        
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        if (!_exists(_tokenId)) revert NoTokenId();
        return buildMetadata(_tokenId);
    }

    function requestRandomness(uint256 _tokenId) internal {
        Result storage result = results[_tokenId];
        if (result.updatedCount != 0 && block.timestamp < result.lastEmited + 1 days)
            revert UpdateNotAvailable();

        uint256 score = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 5 + 1;
        uint256 lastUpdated = block.timestamp;
        uint updatedCount = result.updatedCount + 1;

        result.score = score;
        result.lastEmited = lastUpdated;
        result.updatedCount = updatedCount;

        emit ResultUpdated(msg.sender, score, lastUpdated, updatedCount);
    }

    function buildMetadata(uint256 _tokenId) internal view returns (string memory) {
        uint256 score = results[_tokenId].score;
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"TestNFT ', _tokenId.toString(), '", "description": "Your result is ', score.toString(), '"}')
                    )
                )
            )
        );
    }
}