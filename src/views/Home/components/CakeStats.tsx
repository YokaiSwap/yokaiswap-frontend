import React from 'react'
import { Card, CardBody, Heading, Text } from '@yokaiswap/frontend-uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress()))
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
  // const tvl = `123,456,789`

  return (
    <StyledCakeStats>
      <CardBody>
        <Heading color="#FF4342" scale="xl" mb="24px">
          {t('YOK Stats')}
        </Heading>
        <Row>
          <Text color="#9F9EA6" fontSize="16px">
            {t('Total YOK Supply')}
          </Text>
          {cakeSupply && <CardValue fontSize="16px" value={cakeSupply} />}
        </Row>
        <Row>
          <Text color="#9F9EA6" fontSize="16px">
            {t('Total YOK Burned')}
          </Text>
          <CardValue fontSize="16px" decimals={0} value={burnedBalance} />
        </Row>
        <Row>
          <Text color="#9F9EA6" fontSize="16px">
            {t('New YOK/block')}
          </Text>
          <CardValue fontSize="16px" decimals={0} value={20} />
        </Row>
        {/* <Heading mt="32px" color="#9F9EA6" scale="lg">
          {t('Total Value Locked (TVL)')}
        </Heading>
        {tvl ? (
          <>
            <Heading scale="xl">{`$${tvl}`}</Heading>
            <Text color="#9F9EA6">{t('Across all LPs and Pools')}</Text>
          </>
        ) : (
          <>
            <Skeleton height={66} />
          </>
        )} */}
      </CardBody>
    </StyledCakeStats>
  )
}

export default CakeStats
