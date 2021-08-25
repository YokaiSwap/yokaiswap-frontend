import BigNumber from 'bignumber.js'
import { convertSharesToCake } from 'views/Pools/helpers'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import multicall from 'utils/multicall'

const cakeVaultAddress = getCakeVaultAddress()

export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestYOKRewards',
      'calculateTotalPendingYOKRewards',
    ].map((name) => ({
      address: cakeVaultAddress,
      name,
    }))
    const [sharePrice, shares, estimatedCakeBountyReward, totalPendingCakeHarvest] = await multicall(
      cakeVaultAbi,
      calls,
    )
    const totalSharesAsBigNumber = new BigNumber(shares as string)
    const sharePriceAsBigNumber = new BigNumber(sharePrice as string)
    const totalCakeInVaultEstimate = convertSharesToCake(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: totalCakeInVaultEstimate.cakeAsBigNumber.toJSON(),
      estimatedCakeBountyReward: new BigNumber(estimatedCakeBountyReward as string).toJSON(),
      totalPendingCakeHarvest: new BigNumber(totalPendingCakeHarvest as string).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
      estimatedCakeBountyReward: null,
      totalPendingCakeHarvest: null,
    }
  }
}

export const fetchVaultFees = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((name) => ({
      address: cakeVaultAddress,
      name,
    }))
    const [performanceFee, callFee, withdrawalFee, withdrawalFeePeriod] = await multicall(cakeVaultAbi, calls)
    return {
      performanceFee: parseInt(performanceFee as string, 10),
      callFee: parseInt(callFee as string, 10),
      withdrawalFee: parseInt(withdrawalFee as string, 10),
      withdrawalFeePeriod: parseInt(withdrawalFeePeriod as string, 10),
    }
  } catch (error) {
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
