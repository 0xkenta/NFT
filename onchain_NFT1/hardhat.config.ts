/**
 * @type import('hardhat/config').HardhatUserConfig
 */
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'dotenv/config'
import "@nomiclabs/hardhat-etherscan"

const { API_URL, PRIVATE_KEY, MUMBAI_API_KEY } = process.env

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
      polygonMumbai: MUMBAI_API_KEY
    }
  }
}
