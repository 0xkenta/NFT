import { ethers, network } from "hardhat";
import { expect, use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { TestNFT } from '../typechain-types'
import { Signer, constants } from "ethers";

use(solidity)

describe("NFT.sol", () => {
    let deployer: Signer
    let user1: Signer
    let user2: Signer
    let user1Address: string
    let user2Address: string
    let dNFT: TestNFT

    const emptyAddress = constants.AddressZero

    beforeEach(async () => {
        dNFT = await (await ethers.getContractFactory("TestNFT")).deploy() as TestNFT
    })

    describe("emitOmikuji()", () => {
        it("set result score based on random number", async () => {
            for (let i = 1; i <= 10; i++) {
                await dNFT.emitOmikuji()
                const score = (await dNFT.results(i)).score
                expect(score.toString()).to.be.oneOf(["1", "2", "3", "4", "5"])
            }
        })
        it("emit event if result updated", async () => {
            await expect(dNFT.emitOmikuji()).to.be.emit(dNFT, "ResultUpdated")
        })
        it("set metadata.name with tokenId", async () => {
            for (let i = 1; i <= 10; i++) {
                await dNFT.emitOmikuji()
                const tokenURI = await dNFT.tokenURI(i)
                const { name } = JSON.parse(
                    Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString(
                            'ascii',
                        ),
                );
                expect(name).to.be.eq(`TestNFT ${i}`)
            }
        })
        it("set metadata.description with result score", async () => {
            for (let i = 1; i <= 10; i++) {
                await dNFT.emitOmikuji()
                const tokenURI = await dNFT.tokenURI(i)
                const score = (await dNFT.results(i)).score
                const { description } = JSON.parse(
                    Buffer.from(tokenURI.replace('data:application/json;base64,', ''), 'base64').toString(
                            'ascii',
                        ),
                );
                expect(description).to.be.equal(`Your result is ${score}`)
            }    
        })
    })
    describe("updateOmikuji()", async () => {
        it("revert if it does not take 1 day after last emitting", async () => {
            await dNFT.emitOmikuji()
            await expect(dNFT.updateOmikuji(1)).to.be.revertedWith("UpdateNotAvailable()")
        })
        it("increase uopdatedCount", async () => {
            await dNFT.emitOmikuji()
            const updatedCountBefore = (await dNFT.results(1)).updatedCount
            const blockTimestamp = (await ethers.provider.getBlock("latest")).timestamp
            await network.provider.send("evm_setNextBlockTimestamp", [blockTimestamp + 86400])
            await dNFT.updateOmikuji(1)
            const updatedCountAfter = (await dNFT.results(1)).updatedCount
            expect(updatedCountBefore.toNumber() + 1).to.be.equal(updatedCountAfter.toNumber())
        })
    })
})