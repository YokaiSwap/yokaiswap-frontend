import React from 'react'
import styled from 'styled-components'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <img alt="loading" src="/images/loading.gif" width="160" height="160" />
    </Wrapper>
  )
}

export default PageLoader
