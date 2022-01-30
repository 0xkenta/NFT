pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, PullPayment, Ownable {
    using Counters for Counters.Counter;

    uint256 public constant TOTAL_SUPPLY = 3;
    
    Counters.Counter public currentTokenId;

    string public baseTokenURI;

    constructor() ERC721("NFT TEST", "TEST") {}

    function mintTo(address _recipient) public payable returns (uint256) {
        uint256 tokenId = currentTokenId.current();
        require(tokenId < TOTAL_SUPPLY, "Max supply reached");
        
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(_recipient, newItemId);

        return newItemId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseTokenURI(string calldata _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }
}