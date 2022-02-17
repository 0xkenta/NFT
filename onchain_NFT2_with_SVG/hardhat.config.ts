/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import '@typechain/hardhat'
import 'dotenv/config'
import "@nomiclabs/hardhat-etherscan"

const { API_URL, API_ROPSTEN_URL, PRIVATE_KEY, POLYGONSCAN_API, ETHERSCAN_API } = process.env

module.exports = {
  solidity: "0.8.9",
  networks: {
    polygon_mumbai: {
       url: API_URL,
       accounts: [`0x${PRIVATE_KEY}`]
    },
    ropsten: {
      url: API_ROPSTEN_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      ropsten: ETHERSCAN_API,
      polygonMumbai: POLYGONSCAN_API  
    }
  }
}
