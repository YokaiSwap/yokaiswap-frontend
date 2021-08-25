import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import useRefresh from './useRefresh'
import { useGodwokenAddress } from './useGodwokenAddress'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account } = useWeb3React()
  const godwokenAddress = useGodwokenAddress(account)
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingYOK',
        params: [farm.pid, godwokenAddress],
      }))

      const res = await multicall(masterChefABI, calls)

      setBalance(res)
    }

    if (godwokenAddress) {
      fetchAllBalances()
    }
  }, [godwokenAddress, fastRefresh])

  return balances
}

export default useAllEarnings
