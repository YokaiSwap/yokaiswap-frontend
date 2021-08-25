import React, { useState } from 'react'
import { Button, Skeleton, Text } from '@yokaiswap/frontend-uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { usePriceCakeBusd } from 'state/hooks'
import { useHarvest } from 'hooks/useHarvest'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

import { ActionContainer, ActionTitles, ActionContent, Earned } from './styles'

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, userData, userDataReady, extraRewards }) => {
  const earningsBigNumber = new BigNumber(userData.earnings)
  const cakePrice = usePriceCakeBusd()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />
  const extraEarningsBigNumber = new BigNumber(userData.extraEarnings ?? '0')
  let extraEarnings = BIG_ZERO
  let displayExtraBalance = userDataReady ? extraEarnings.toLocaleString() : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(3, BigNumber.ROUND_DOWN)
  }

  if (!extraEarningsBigNumber.isZero()) {
    extraEarnings = getBalanceAmount(extraEarningsBigNumber)
    displayExtraBalance = extraEarnings.toFixed(3, BigNumber.ROUND_DOWN)
  }

  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { toastError } = useToast()

  return (
    <ActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          YOK{extraRewards != null && ` + ${extraRewards.rewardToken.symbol}`}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Earned>{displayBalance}</Earned>
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        {extraRewards != null && (
          <div>
            <Earned>{displayExtraBalance}</Earned>
            <Text fontSize="12px" color="textSubtle">
              {extraRewards.rewardToken.symbol}
            </Text>
          </div>
        )}
        <Button
          disabled={earnings.eq(0) || pendingTx || !userDataReady}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onReward()
              dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
            } catch (error) {
              console.error(error)
              toastError(t('Error'), t('%error% - Please try again.', { error: error.message || error }))
            } finally {
              setPendingTx(false)
            }
          }}
          ml="4px"
        >
          {t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
