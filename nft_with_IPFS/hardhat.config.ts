/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-etherscan"
import 'dotenv/config'

const { API_URL, PRIVATE_KEY, mumbaiAPI } = process.env;

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    polygon_mumbai: {
       url: API_URL,
       accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: mumbaiAPI
    }
  }
}
