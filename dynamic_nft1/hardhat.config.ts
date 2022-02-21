/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 import "@nomiclabs/hardhat-waffle"
 import "@nomiclabs/hardhat-ethers"
 import "@nomiclabs/hardhat-etherscan"
 import '@typechain/hardhat'
 import 'dotenv/config'
 
 const { API_URL, PRIVATE_KEY, POLYGON_ETHERSCAN_API } = process.env
 
 module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: API_URL
      }
  },
  polygon_mumbai: {
    url: API_URL,
    accounts: [`0x${PRIVATE_KEY}`],
    gas: 2100000,
    gasPrice: 8000000000
  }
  },
   etherscan: {
     apiKey: {
       polygonMumbai: POLYGON_ETHERSCAN_API
     }
   }
 }
