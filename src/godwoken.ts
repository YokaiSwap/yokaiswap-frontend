/* eslint-disable @typescript-eslint/no-non-null-assertion */
import PolyjuiceHttpProvider, { PolyjuiceConfig } from '@polyjuice-provider/web3'
import { Script, utils } from '@ckb-lumos/base'
import { isAddress, getAddress } from '@ethersproject/address'

const polyjuiceConfig: PolyjuiceConfig = {
  rollupTypeHash: process.env.REACT_APP_GW_ROLLUP_TYPE_HASH!,
  ethAccountLockCodeHash: process.env.REACT_APP_GW_POLYJUICE_ETH_ACCOUNT_LOCK_CODE_HASH!,
  web3Url: process.env.REACT_APP_GW_POLYJUICE_RPC_URL!,
}

export default new PolyjuiceHttpProvider(process.env.REACT_APP_GW_POLYJUICE_RPC_URL!, polyjuiceConfig)

export function generateETHAccountLock(ethAddr: string): Script {
  return {
    code_hash: polyjuiceConfig.ethAccountLockCodeHash,
    hash_type: 'type',
    args: polyjuiceConfig.rollupTypeHash + ethAddr.slice(2),
  }
}

const cachedAddresses: { [ethAddress: string]: string } = {}

export function ethEoaAddressToGodwokenShortAddress(ethAddress: string): string {
  const cachedAddress = cachedAddresses[ethAddress]
  if (cachedAddress != null) {
    return cachedAddress
  }

  if (!isAddress(ethAddress)) {
    throw new Error('invalid eth address')
  }

  const ethAccountLock = generateETHAccountLock(ethAddress)
  const scriptHash = utils.computeScriptHash(ethAccountLock)
  const shortAddress = scriptHash.slice(0, 42)
  const result = getAddress(shortAddress)
  cachedAddresses[ethAddress] = result
  return result
}
