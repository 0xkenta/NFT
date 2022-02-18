import { ethers } from "hardhat";
import { expect, use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { NFT } from '../typechain-types'
import { Signer, constants } from "ethers";

use(solidity)

describe("NFT.sol", () => {
    let deployer: Signer
    let user1: Signer
    let user2: Signer
    let user1Address: string
    let user2Address: string
    let nftContract: NFT

    const message = "HELLO"
    const color = "red"

    const emptyAddress = constants.AddressZero

    beforeEach(async () => {
        [deployer, user1, user2] = await ethers.getSigners()
        user1Address = await user1.getAddress()
        user2Address = await user2.getAddress()
        const nftFactory = await ethers.getContractFactory("NFT")
        nftContract = await nftFactory.deploy() as NFT
    })

    describe("constructor()",() => {
        it("name", async () => {
            expect(await nftContract.name()).to.be.equal("TEST NFT")
        })
        it("symbol", async () => {
            expect(await nftContract.symbol()).to.be.equal("TEST")
        })
    })

    describe("mint()", () => {
        it("revert if color is invalid", async () => {
            await expect(nftContract.mint("yellow", message))
                .to.be.revertedWith("InvalidColor()")
        })
        it("revert if words exceed length limit", async () => {
            await expect(nftContract.mint(color, "TOO MANY WORDS ARE GIVEN"))
                .to.be.revertedWith("TooLongMessage()")
        })
        it("update wordsToTokenId if minted", async () => {
            await nftContract.mint(color, message)
            const word = await nftContract.itemInfoToTokenId(1)
            expect(word[0]).to.be.equal("NFT 1")
            expect(word[1]).to.be.equal("Test NFT only background and message in the center of image")
            expect(word[2]).to.be.equal(message)
            expect(word[3]).to.be.equal(color)
        })
        it("emit event if minted", async () => {
            await expect(await nftContract.connect(user1).mint(color, message))
                .to.emit(nftContract, "Transfer")
                .withArgs(emptyAddress, user1Address, 1)
        })
        it("update total supply", async () => {
            const randomNumber = Math.floor(Math.random() * 10)
            for (let i = 0; i < randomNumber; i++) {
                await nftContract.connect(user1).mint(color, message)
            }
            expect(await nftContract.totalSupply()).to.be.equal(randomNumber)
        })
        it("update tokenOfOwnerByIndex and tokenByIndex", async () => {
            await nftContract.connect(user1).mint(color, message)
            await nftContract.connect(user2).mint(color, message)
            await nftContract.connect(user1).mint(color, message)
            await nftContract.connect(deployer).mint(color, message)
            await nftContract.connect(user2).mint(color, message)
            
            expect(await nftContract.tokenOfOwnerByIndex(user1Address, 0)).to.be.equal(1)
            expect(await nftContract.tokenOfOwnerByIndex(user1Address, 1)).to.be.equal(3)
            expect(await nftContract.tokenOfOwnerByIndex(user2Address, 0)).to.be.equal(2)
            expect(await nftContract.tokenOfOwnerByIndex(user2Address, 1)).to.be.equal(5)

            expect(await nftContract.tokenByIndex(0)).to.be.equal(1)
            expect(await nftContract.tokenByIndex(4)).to.be.equal(5)
        })
    })

    describe("tokenURI()", () => {
        it("revert if there is no minted token id", async () => {
            await expect(nftContract.tokenURI(2)).to.be.revertedWith("NoNFT()")
        })
    })

    describe("buildMetadata()", () => {
        it("return metadata", async () => {
            await nftContract.mint(color, message)
            const tokenURI = await nftContract.tokenURI(1)
            const { name, description, image } = JSON.parse(
                Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString(
                    'ascii',
                ),
            )

            expect(name).to.be.equal("NFT 1")
            expect(description).to.be.equal("Test NFT only background and message in the center of image")
            expect(image).to.not.be.undefined
            console.log(image)
        })
    })
})