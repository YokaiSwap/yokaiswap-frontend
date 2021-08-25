import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading } from '@yokaiswap/frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import { usePriceCakeBusd } from 'state/hooks'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  shouldHideHarvest?: boolean
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid, shouldHideHarvest = false }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const cakePrice = usePriceCakeBusd()
  const dispatch = useAppDispatch()
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0
  const { toastError } = useToast()

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        {!shouldHideHarvest && earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
      {!shouldHideHarvest && (
        <Button
          disabled={rawEarningsBalance.eq(0) || pendingTx}
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
        >
          {t('Harvest')}
        </Button>
      )}
    </Flex>
  )
}

export default HarvestAction
