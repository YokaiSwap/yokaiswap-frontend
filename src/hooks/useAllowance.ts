import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { getLotteryAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { useCake } from './useContract'
import useRefresh from './useRefresh'
import { useGodwokenAddress } from './useGodwokenAddress'

// Retrieve lottery allowance
export const useLotteryAllowance = () => {
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const godwokenAddress = useGodwokenAddress(account)
  const cakeContract = useCake()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await cakeContract.methods
        .allowance(godwokenAddress, getLotteryAddress())
        .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })
      setAllowance(new BigNumber(res))
    }

    if (godwokenAddress != null) {
      fetchAllowance()
    }
  }, [godwokenAddress, cakeContract, fastRefresh])

  return allowance
}

// Retrieve IFO allowance
export const useIfoAllowance = (tokenContract: Contract, spenderAddress: string, dependency?: any): BigNumber => {
  const { account } = useWeb3React()
  const godwokenAddress = useGodwokenAddress(account)
  const [allowance, setAllowance] = useState(BIG_ZERO)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract.methods
          .allowance(godwokenAddress, spenderAddress)
          .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })
        setAllowance(new BigNumber(res))
      } catch (e) {
        console.error(e)
      }
    }

    if (godwokenAddress) {
      fetch()
    }
  }, [godwokenAddress, spenderAddress, tokenContract, dependency])

  return allowance
}
