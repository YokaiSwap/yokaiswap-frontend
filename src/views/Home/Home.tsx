import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@yokaiswap/frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import CakeStats from 'views/Home/components/CakeStats'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'

const StyledPageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: radial-gradient(89.56% 89.56% at 50.04% 10.44%, #3c3a4b 0%, #1c1b25 92.56%);
  background-repeat: no-repeat;
  background-position: top center;
`

const Hero = styled.div`
  background-image: url('/images/illustration-gray.png');
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: contain;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/illustration.png');
    background-size: 489px auto;
    margin-bottom: -64px;
    padding-top: 0;
    padding-bottom: 379px;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 16px;
  grid-gap: 24px;

  & > div {
    grid-column: span 8;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 24px;

    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 16px;
  grid-gap: 24px;

  & > div {
    grid-column: span 8;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 24px;

    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 4;
    }

    & > div:nth-child(2) {
      grid-column: span 8;
    }
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <StyledPageContainer>
      <Page>
        <Hero>
          <Heading as="h1" scale="xl" mb="24px" color="#ffffff">
            {t('YokaiSwap')}
          </Heading>
          <Text>{t('A next evolution DeFi exchange on Nervos Network.')}</Text>
        </Hero>
        <div>
          <Cards>
            <FarmStakingCard />
            <CakeStats />
          </Cards>
          <CTACards>
            <EarnAPRCard />
            <EarnAssetCard />
          </CTACards>
        </div>
      </Page>
    </StyledPageContainer>
  )
}

export default Home
