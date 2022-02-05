import { ethers } from "hardhat";
import { expect, use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { NFT } from '../typechain-types'
import { Signer, constants } from "ethers";

use(solidity);

describe("NFT.sol", () => {
    let deployer: Signer
    let user1: Signer
    let user1Address: string
    let nftContract: NFT

    const message = "HELLO WORLD"
    const color = "red"

    const emptyAddress = constants.AddressZero

    beforeEach(async () => {
        [deployer, user1] = await ethers.getSigners()
        user1Address = await user1.getAddress()
        const nftFactory = await ethers.getContractFactory("NFT")
        nftContract = await nftFactory.deploy() as NFT
    })

    describe("constructor()",() => {
        it("name", async () => {
            expect(await nftContract.name()).to.be.equal("NEW TEST NFT")
        })
        it("symbol", async () => {
            expect(await nftContract.symbol()).to.be.equal("TEST2")
        })
    })

    describe("mint()", () => {
        it("revert if color is invalid", async () => {
            await expect(nftContract.mint(message, "yellow"))
                .to.be.revertedWith("COLOR_IS_NOT_VALID")
        })
        it("revert if words exceed length limit", async () => {
            await expect(nftContract.mint("TOO MANY WORDS ARE GIVEN", color))
                .to.be.revertedWith("message is to long")
        })
        it("update wordsToTokenId if minted", async () => {
            await nftContract.mint(message, color)
            const word = await nftContract.wordsToTokenId(1)
            expect(word[0]).to.be.equal("NFT 1")
            expect(word[1]).to.be.equal("Test NFT only background and message in the center of image")
            expect(word[2]).to.be.equal(message)
            expect(word[3]).to.be.equal(color)
        })
        it("emit event if minted", async () => {
            await expect(await nftContract.connect(user1).mint(message, color))
                .to.emit(nftContract, "Transfer")
                .withArgs(emptyAddress, user1Address, 1)
        })
        // it("update total supply", async () => {
        //     await nftContract.mint(message, color)
        //     await nftContract.connect(user1).mint(message, color)
        //     expect(await nftContract.totalSupply()).to.be.equal(2)
        // })
    })
})
