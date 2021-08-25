import { Campaign } from 'config/constants/types'
import { getPointCenterIfoContract } from 'utils/contractHelpers'
import ifosList from 'config/constants/ifo'
import { campaignMap } from 'config/constants/campaigns'
import { Achievement, TranslatableText } from 'state/types'
import makeBatchRequest from './makeBatchRequest'
import { ethEoaAddressToGodwokenShortAddress } from '../godwoken'

interface IfoMapResponse {
  thresholdToClaim: string
  campaignId: string
  numberPoints: string
}

export const getAchievementTitle = (campaign: Campaign): TranslatableText => {
  switch (campaign.type) {
    case 'ifo':
      return {
        key: 'IFO Shopper: %title%',
        data: {
          title: campaign.title as string,
        },
      }
    default:
      return campaign.title
  }
}

export const getAchievementDescription = (campaign: Campaign): TranslatableText => {
  switch (campaign.type) {
    case 'ifo':
      return {
        key: 'Committed more than $5 worth of LP in the %title% IFO',
        data: {
          title: campaign.title as string,
        },
      }
    default:
      return campaign.description
  }
}

/**
 * Checks if a wallet is eligible to claim points from valid IFO's
 */
export const getClaimableIfoData = async (account: string): Promise<Achievement[]> => {
  const ifoCampaigns = ifosList.filter((ifoItem) => ifoItem.campaignId !== undefined)
  const ifoCampaignAddresses = ifoCampaigns.map((ifoItem) => ifoItem.address)
  const pointCenterContract = getPointCenterIfoContract()

  const godwokenAddress = ethEoaAddressToGodwokenShortAddress(account)
  // Returns the claim status of every IFO with a campaign ID
  const claimStatuses = (await pointCenterContract.methods
    .checkClaimStatuses(godwokenAddress, ifoCampaignAddresses)
    .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })) as boolean[]

  // Get IFO data for all IFO's that are eligible to claim
  const claimableIfoData = (await makeBatchRequest(
    claimStatuses.reduce((accum, claimStatus, index) => {
      if (claimStatus === true) {
        return [...accum, pointCenterContract.methods.ifos(ifoCampaignAddresses[index]).call]
      }

      return accum
    }, []),
  )) as IfoMapResponse[]

  // Transform response to an Achievement
  return claimableIfoData.reduce((accum, claimableIfoDataItem) => {
    if (!campaignMap.has(claimableIfoDataItem.campaignId)) {
      return accum
    }

    const campaignMeta = campaignMap.get(claimableIfoDataItem.campaignId)
    const { address } = ifoCampaigns.find((ifoCampaign) => ifoCampaign.campaignId === claimableIfoDataItem.campaignId)

    return [
      ...accum,
      {
        address,
        id: claimableIfoDataItem.campaignId,
        type: 'ifo',
        title: getAchievementTitle(campaignMeta),
        description: getAchievementDescription(campaignMeta),
        badge: campaignMeta.badge,
        points: Number(claimableIfoDataItem.numberPoints),
      },
    ]
  }, [])
}
