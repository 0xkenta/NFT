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
  solidity: "0.8.9",
  networks: {
    polygon_mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGON_ETHERSCAN_API
    }
  }
}
