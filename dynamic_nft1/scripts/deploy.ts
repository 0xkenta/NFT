import { ethers } from 'hardhat'

async function main() {
    const nftFactory = await ethers.getContractFactory("NFT")
    const nft = await nftFactory.deploy()
  
    console.log("Token address:", nft.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })