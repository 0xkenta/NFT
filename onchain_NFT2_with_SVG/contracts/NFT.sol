pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Base64 } from 'base64-sol/base64.sol';

error NoNFT();
error TooLongMessage();
error InvalidColor();

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct ItemInfo {
        string name;
        string description;
        string message;
        string color;
    }

    mapping (uint256 => ItemInfo) public itemInfoToTokenId;
    uint8 public messageLimit = 8;

    constructor() ERC721("TEST NFT", "TEST") {}

    function mint(string calldata _color, string calldata _message) public {
        bytes32 color = bytes32(bytes(_color));
        if (color != bytes32("red") && color != bytes32("green"))
            revert InvalidColor();

        bytes memory messageBytes = bytes(_message);
        if (messageBytes.length > messageLimit) revert TooLongMessage();

        uint256 newTokenId = totalSupply() + 1;

        ItemInfo memory newItem = ItemInfo(
            string(abi.encodePacked("NFT ", newTokenId.toString())),
            "Test NFT only background and message in the center of image",
            _message,
            _color
        );
        itemInfoToTokenId[newTokenId] = newItem;

        _safeMint(msg.sender, newTokenId);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        if (!_exists(_tokenId)) revert NoNFT();
        return buildMetadata(_tokenId);
    }

    function buildMetadata(uint256 _tokenId) private view returns (string memory) {
        ItemInfo memory _item = itemInfoToTokenId[_tokenId];
        string memory image = buildImage(_item.color, _item.message);
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            _item.name,
                            '", "description": "',
                            _item.description,
                            '", "image":"',
                            "data:image/svg+xml;base64,",
                            image,
                            '"}'    
                        )
                    )
                )    
            )
        );
    }

    function buildImage(string memory _color, string memory _message) private pure returns (string memory) {
        return Base64.encode(
            bytes(
                abi.encodePacked(
                    '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">',
                    '<circle cx="50" cy="50" r="40" fill="',_color,'" />',
                    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white">',
                    _message,
                    '</text>',
                    '</svg>'
                )
            )
        );
    }
}