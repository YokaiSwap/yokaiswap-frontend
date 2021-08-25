// Set of helper functions to facilitate wallet setup

// import { BASE_BSC_SCAN_URL } from 'config'
// import { nodes } from './getRpcUrl'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = (window as WindowChain).ethereum
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
          },
        ],
      })
      return true
    } catch (error: any) {
      if (error?.code === 4902 || error?.code === -32601) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              chainId === 1024777
                ? {
                    chainId: `0x${chainId.toString(16)}`,
                    chainName: 'Godwoken Polyjuice Devnet',
                    nativeCurrency: {
                      name: 'CKB',
                      symbol: 'CKB',
                      decimals: 18,
                    },
                    rpcUrls: ['http://localhost:8024'],
                    blockExplorerUrls: null,
                  }
                : {
                    chainId: `0x${chainId.toString(16)}`,
                    chainName: 'Godwoken Polyjuice Testnet',
                    nativeCurrency: {
                      name: 'CKB',
                      symbol: 'CKB',
                      decimals: 18,
                    },
                    rpcUrls: ['https://godwoken-testnet-web3-rpc.ckbapp.dev'],
                    blockExplorerUrls: null,
                  },
            ],
          })
          return true
        } catch (err) {
          console.error(err)
          return false
        }
      } else {
        console.error(error)
        return false
      }
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  const tokenAdded = await (window as WindowChain).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  })

  return tokenAdded
}
