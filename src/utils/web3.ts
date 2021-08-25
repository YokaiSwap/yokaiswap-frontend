import Web3 from 'web3'
// import { HttpProviderOptions } from 'web3-core-helpers'
// import { ARCHIVED_NODE } from 'config/constants/endpoints'
// import getRpcUrl from 'utils/getRpcUrl'
import polyjuiceHttpProvider from '../godwoken'

// const RPC_URL = getRpcUrl()

// const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
const web3NoAccount = new Web3(polyjuiceHttpProvider)

// const archivedHttpProvider = new Web3.providers.HttpProvider(ARCHIVED_NODE, { timeout: 10000 } as HttpProviderOptions)
export const web3WithArchivedNodeProvider = web3NoAccount

export default web3NoAccount
