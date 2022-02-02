import { ethers } from "hardhat"
import { Signer, constants } from "ethers"
import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { NFT } from '../typechain-types/'

use(solidity);

describe("NFT.sol", () => {
    let deployer: Signer
    let user1: Signer
    let deployerAddress: string
    let addressZero = constants.AddressZero

    let nft: NFT

    beforeEach(async () => {
        [deployer, user1] = await ethers.getSigners()
        deployerAddress = await deployer.getAddress()
        const nftFactor = await ethers.getContractFactory("NFT")  
        nft = await nftFactor.deploy() as NFT
    })

    describe("constructor", () => {
        it("name", async () => {
            expect(await nft.name()).to.be.equal("TEST NFT")
        })
        it("symbol", async () => {
            expect(await nft.symbol()).to.be.equal("TEST")
        })
    })

    describe("mint()", () => {
        it("revert if msg.sender is not contract owner", async () => {
            await expect(nft.connect(user1).mint()).to.be.revertedWith("Only owner can mint")
        })
        it("emit event if sucesses", async () => {
            await expect(nft.connect(deployer).mint())
                .to.emit(nft, 'Transfer')
                .withArgs(addressZero, deployerAddress, 1)
        })
        it("update wordsToTokenId", async () => {
            await nft.connect(deployer).mint()
            const result = await nft.wordsToTokenId(1)
            expect(result[0]).to.be.equal("Test NFT 1")
            expect(result[1]).to.be.equal("This is Test NFT produced by KS")
            expect(result[2]).to.be.equal("https://ipfs.io/ipfs/QmbrwFPTUea3FTJWn6LVbQm2ijWTSGLJmReajEP7aF4pmX")
        })
        it("update ERC721 special functions" , async () => {
            await nft.connect(deployer).mint()
            await nft.connect(deployer).mint()
            expect(await nft.totalSupply()).to.be.equal(2)
            expect(await nft.tokenOfOwnerByIndex(deployerAddress, 1)).to.be.equal(2)
            expect(await nft.tokenByIndex(1)).to.be.equal(2)
        })
    })
    
    describe("tokenURI()", async () => {
        it("return name, description and image with base64", async () => {
            await nft.connect(deployer).mint()
            const tokenURI = await nft.tokenURI(1)
            const { name, description, image } = JSON.parse(
                Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString(
                    'ascii',
                ),
            )
            expect(name).to.be.equal("Test NFT 1")
            expect(description).to.be.equal("This is Test NFT produced by KS")
            expect(image).to.be.equal("https://ipfs.io/ipfs/QmbrwFPTUea3FTJWn6LVbQm2ijWTSGLJmReajEP7aF4pmX")
        })
    })
})