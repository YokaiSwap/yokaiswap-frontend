import { useEffect, useState } from 'react'
import { usePredictionsContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { useGodwokenAddress } from '../../../hooks/useGodwokenAddress'

const useIsRefundable = (epoch: number) => {
  const [isRefundable, setIsRefundable] = useState(false)
  const predictionsContract = usePredictionsContract()
  const { account } = useWeb3React()
  const godwokenAddress = useGodwokenAddress(account)

  useEffect(() => {
    const fetchRefundableStatus = async () => {
      const canClaim = await predictionsContract.methods
        .claimable(epoch, godwokenAddress)
        .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })

      if (canClaim) {
        const refundable = await predictionsContract.methods
          .refundable(epoch, godwokenAddress)
          .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })
        setIsRefundable(refundable)
      } else {
        setIsRefundable(false)
      }
    }

    if (godwokenAddress) {
      fetchRefundableStatus()
    }
  }, [godwokenAddress, epoch, predictionsContract, setIsRefundable])

  return { isRefundable, setIsRefundable }
}

export default useIsRefundable
