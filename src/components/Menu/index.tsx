import React, { useCallback, useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames, Menu as UikitMenu } from '@yokaiswap/frontend-uikit'
import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { usePriceCakeBusd } from 'state/hooks'
import config from './config'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID!, 10)

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const handleConnect = useCallback(() => {
    login(ConnectorNames.Injected)
    window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.Injected)
  }, [login])
  const handleDisconnect = useCallback(() => {
    logout()
    window.localStorage.removeItem(connectorLocalStorageKey)
  }, [logout])

  const autoConnect = useCallback(
    (id = Number(window.ethereum?.chainId)) => {
      const key = window.localStorage.getItem(connectorLocalStorageKey)
      if (key === ConnectorNames.Injected && Number(id) === chainId) {
        login(ConnectorNames.Injected)
      }
    },
    [login],
  )

  useEffect(() => {
    ;(window.ethereum as any)?.addListener('chainChanged', autoConnect)
    const timeoutId = window.setTimeout(autoConnect, 500)

    return () => {
      window.clearTimeout(timeoutId)
      ;(window.ethereum as any)?.removeListener('chainChanged', autoConnect)
    }
  }, [autoConnect])

  return (
    <UikitMenu
      account={account}
      login={handleConnect}
      logout={handleDisconnect}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config(t)}
      profile={undefined}
      {...props}
    />
  )
}

export default Menu
