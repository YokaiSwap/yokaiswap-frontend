import React, { useEffect, useState } from 'react'
import { PromiEvent } from 'web3-core'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { useBunnySpecialContract } from 'hooks/useContract'
import NftCard, { NftCardProps } from './index'
import { useGodwokenAddress } from '../../../../hooks/useGodwokenAddress'

const BunnySpecialCard: React.FC<NftCardProps> = ({ nft, ...props }) => {
  const [isClaimable, setIsClaimable] = useState(false)
  const { account } = useWeb3React()
  const godwokenAddress = useGodwokenAddress(account)
  const bunnySpecialContract = useBunnySpecialContract()
  const { variationId } = nft

  const handleClaim = (): PromiEvent<Contract> => {
    return bunnySpecialContract.methods.mintNFT(variationId).send({ from: account })
  }

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaimSingle = await bunnySpecialContract.methods
        .canClaimSingle(godwokenAddress, variationId)
        .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })
      setIsClaimable(canClaimSingle)
    }

    if (godwokenAddress) {
      fetchClaimStatus()
    }
  }, [godwokenAddress, variationId, bunnySpecialContract, setIsClaimable])

  return <NftCard nft={nft} {...props} canClaim={isClaimable} onClaim={handleClaim} />
}

export default BunnySpecialCard
