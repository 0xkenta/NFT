pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract NFT is  ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct Word {
        string name;
        string description;
        string image;
    }

    mapping(uint256 => Word) public wordsToTokenId;

    constructor() ERC721("TEST NFT", "TEST") {}

    function mint() external payable {
        require(msg.sender == owner(), "Only owner can mint");
        uint256 newTokenId = uint256(totalSupply() + 1);

        Word memory _word = Word(
            string(abi.encodePacked("Test NFT ", newTokenId.toString())),
            "This is Test NFT produced by KS",
            "https://ipfs.io/ipfs/QmbrwFPTUea3FTJWn6LVbQm2ijWTSGLJmReajEP7aF4pmX"
        );

        wordsToTokenId[newTokenId] = _word;
        _safeMint(msg.sender, newTokenId);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "No token with this Id");
        return buildMetadata(_tokenId);
    }

    function buildMetadata(uint256 _tokenId) private view returns (string memory) {
        Word memory selectedWord = wordsToTokenId[_tokenId];

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"', selectedWord.name, '", "description":"', selectedWord.description, '", "image": "', selectedWord.image, '"}')
                    )
                )
            )    
        );
    }
}

