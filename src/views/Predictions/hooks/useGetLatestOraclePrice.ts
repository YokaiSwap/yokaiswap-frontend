import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useChainlinkOracleContract } from 'hooks/useContract'
import useLastUpdated from 'hooks/useLastUpdated'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'

const useGetLatestOraclePrice = () => {
  const [price, setPrice] = useState(BIG_ZERO)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const chainlinkOracleContract = useChainlinkOracleContract()

  useEffect(() => {
    const fetchPrice = async () => {
      const response = await chainlinkOracleContract.methods
        .latestAnswer()
        .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })
      setPrice(getBalanceAmount(new BigNumber(response), 8))
    }

    fetchPrice()
  }, [chainlinkOracleContract, lastUpdated, setPrice])

  return { price, lastUpdated, refresh }
}

export default useGetLatestOraclePrice
