import {expect, use} from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers } from "hardhat"
import { Signer } from 'ethers'
import { NFT } from '../typechain-types'
import exp from 'constants'

use(solidity)

describe("NFT", () => {
    let deployer: Signer
    let user1: Signer
    let user2: Signer
    let user3: Signer
    let user4: Signer
    let user1Address: string
    let user2Address: string
    let user3Address: string
    let user4Address: string
    let nft: NFT

    beforeEach(async () => {
        [deployer, user1, user2, user3, user4] = await ethers.getSigners()    
        user1Address = await user1.getAddress()  
        user2Address = await user2.getAddress()  
        user3Address = await user3.getAddress()  
        user4Address = await user4.getAddress()  

        const nftFactory = await ethers.getContractFactory("NFT")
        nft = await nftFactory.deploy() as NFT
    })

    describe("constructor", () => {
        it("name", async () => {
            expect(await nft.name()).to.be.equal("NFT TEST")
        })
        it("symbol", async () => {
            expect(await nft.symbol()).to.be.equal("TEST")    
        })
    })

    describe("mintTo", () => {
        it("mint token", async () => {
            expect(await nft.callStatic.mintTo(user1Address)).to.equal(1)
        })
        it("update balanceOf and owner", async () => {
            await nft.mintTo(user1Address)
            expect(await nft.balanceOf(user1Address)).to.be.equal(1)
            expect(await nft.ownerOf(1)).to.be.equal(user1Address)
        })
        it("revert if request is more than total supply", async () => {
            await nft.connect(user1).mintTo(user1Address)
            await nft.connect(user2).mintTo(user2Address)
            await nft.connect(user3).mintTo(user3Address)
            await expect(nft.connect(user4).mintTo(user4Address)).to.be.revertedWith("Max supply reached")
        })
    })

    describe("serBaseTokenURI", () => {
        it ("revert if msg.sender is not owner", async () => {
            await expect(nft.connect(user1).setBaseTokenURI("123456"))
                .to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("update baseTokenURI", async () => {
            expect(await nft.baseTokenURI()).to.be.equal("")
            const newTokenURI = "abcdef"
            await nft.connect(deployer).setBaseTokenURI(newTokenURI)
            expect(await nft.baseTokenURI()).to.be.equal(newTokenURI)
        })
    })

    describe("tokenURI", () => {
        it("return baseTokenURI + tokenId", async () => {
            await nft.setBaseTokenURI("123456/")
            await nft.mintTo(user1Address)
            expect(await nft.tokenURI(1)).to.be.equal("123456/1")
        })
    })
})