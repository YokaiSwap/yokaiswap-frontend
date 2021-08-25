import BigNumber from 'bignumber.js'
import { getCakeVaultContract } from 'utils/contractHelpers'
import { ethEoaAddressToGodwokenShortAddress } from '../../godwoken'

const cakeVaultContract = getCakeVaultContract()

const fetchVaultUser = async (account: string) => {
  try {
    const userContractResponse = await cakeVaultContract.methods
      .userInfo(ethEoaAddressToGodwokenShortAddress(account))
      .call({ from: '0x3089EA87cD8dc04E0985E0C0DA272E399a7C289A' })
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime as string,
      lastUserActionTime: userContractResponse.lastUserActionTime as string,
      cakeAtLastUserAction: new BigNumber(userContractResponse.yokAtLastUserAction).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser
