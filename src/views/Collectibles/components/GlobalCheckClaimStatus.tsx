import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useModal } from '@yokaiswap/frontend-uikit'
import { useProfile } from 'state/hooks'
import { useEasterNftContract } from 'hooks/useContract'
import NftGiveawayModal from './NftGiveawayModal'
import { useGodwokenAddress } from '../../../hooks/useGodwokenAddress'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */
const GlobalCheckClaimStatus: React.FC<GlobalCheckClaimStatusProps> = ({ excludeLocations }) => {
  const hasDisplayedModal = useRef(false)
  const [isClaimable, setIsClaimable] = useState(false)
  const [onPresentGiftModal] = useModal(<NftGiveawayModal />)
  const easterNftContract = useEasterNftContract()
  const { profile } = useProfile()
  const { account } = useWeb3React()
  const godwokenAddress = useGodwokenAddress(account)
  const { pathname } = useLocation()

  // Check claim status
  useEffect(() => {
    const fetchClaimStatus = async () => {
      const canClaim = await easterNftContract.methods
        .canClaim(godwokenAddress)
        .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })
      setIsClaimable(canClaim)
    }

    // Wait until we have a profile
    if (godwokenAddress && profile) {
      fetchClaimStatus()
    }
  }, [easterNftContract, godwokenAddress, profile, setIsClaimable])

  // Check if we need to display the modal
  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => pathname.includes(location))

    if (isClaimable && !matchesSomeLocations && !hasDisplayedModal.current) {
      onPresentGiftModal()
      hasDisplayedModal.current = true
    }
  }, [pathname, isClaimable, excludeLocations, hasDisplayedModal, onPresentGiftModal])

  // Reset the check flag when account changes
  useEffect(() => {
    hasDisplayedModal.current = false
  }, [account, hasDisplayedModal])

  return null
}

export default GlobalCheckClaimStatus
