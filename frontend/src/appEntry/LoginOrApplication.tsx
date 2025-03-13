import React, { useContext, useEffect, useState } from 'react'
import { AppInstance } from './appContainer/AppContext'
import LoginView from '../views/login/LoginView'
import AppLoader from '../views/components/AppLoader'
import { USER_TOKEN } from '../types/Constants'
import { ITokenAuth } from '../internal/models/Account'
import SequenceController from './SequenceController'

export default function LoginOrApplication() {
  const {
    currentUser,
    setCurrentUser,
    api,
    cookies,
    settingsManager
  } = useContext(AppInstance)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    handleInitialSequenceState()
  }, [])

  async function handleInitialSequenceState() {
    const refresh_token = cookies.getRefreshToken()
    const data = await api.auth.refreshAccessToken(refresh_token)
    if (data?.access_token) {
      await loadUserFromToken({
        access_token: data.access_token,
        refresh_token
      })
    } else {
      cookies.clearRefreshToken()
    }

    setLoading(false)
  }

  async function loadUserFromToken(auth: ITokenAuth) {
    const user = await api.account.loadPortalUser(auth)
    if (user) {
      // update token
      cookies.setRefreshToken(user.refresh_token)
      // load app settings
      await settingsManager.init(api, auth)
      // save user to context
      setCurrentUser({ ...user })
    } else {
      console.warn('[sequenceController] could not load user from token')
    }
  }

  if (loading) {
    return <AppLoader />
  }

  if (currentUser) {
    return <SequenceController />
  }

  // default route is for login view
  return <LoginView onLoginSuccess={loadUserFromToken} />
}

