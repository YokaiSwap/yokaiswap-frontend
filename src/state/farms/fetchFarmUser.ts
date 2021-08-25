import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import stakingRewardsABI from 'config/abi/stakingRewards.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'
import { ethEoaAddressToGodwokenShortAddress } from '../../godwoken'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const godwokenAddress = ethEoaAddressToGodwokenShortAddress(account)

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [godwokenAddress, masterChefAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const godwokenAddress = ethEoaAddressToGodwokenShortAddress(account)
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [godwokenAddress],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const godwokenAddress = ethEoaAddressToGodwokenShortAddress(account)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, godwokenAddress],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  const godwokenAddress = ethEoaAddressToGodwokenShortAddress(account)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'pendingYOK',
      params: [farm.pid, godwokenAddress],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchFarmUserExtraEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const godwokenAddress = ethEoaAddressToGodwokenShortAddress(account)

  const isfarmsWithExtraRewards: { [pid: number]: boolean } = {}
  const farmsWithExtraRewards = farmsToFetch.filter((farm, i) => {
    const result = farm.extraRewards != null
    isfarmsWithExtraRewards[i] = result
    return result
  })
  const calls = farmsWithExtraRewards.map((farm) => {
    return {
      address: farm.extraRewards.stakingRewards,
      name: 'earned',
      params: [godwokenAddress],
    }
  })

  const rawEarnings = await multicall(stakingRewardsABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })

  let j = 0
  return farmsToFetch.map((_, i) => {
    if (!isfarmsWithExtraRewards[i]) {
      return null
    }

    return parsedEarnings[j++]
  })
}
