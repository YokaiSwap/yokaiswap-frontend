import React, { useCallback } from 'react'
import { Button, connectorLocalStorageKey, ConnectorNames, useWalletModal } from '@yokaiswap/frontend-uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const handleConnect = useCallback(() => {
    login(ConnectorNames.Injected)
    window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.Injected)
  }, [login])
  const handleDisconnect = useCallback(() => {
    logout()
    window.localStorage.removeItem(connectorLocalStorageKey)
  }, [logout])
  const { onPresentConnectModal } = useWalletModal(handleConnect, handleDisconnect)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
