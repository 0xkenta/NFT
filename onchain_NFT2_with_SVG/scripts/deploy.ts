import { ethers } from 'hardhat'

async function main() {
    // We get the contract to deploy
    const nftFactory = await ethers.getContractFactory("NFT");
    const nft = await nftFactory.deploy();
  
    console.log("Greeter deployed to:", nft.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });