import React, { useEffect, useState } from 'react'
import ApiController from '../controllers/ApiController'
import LoginOrApplication from './LoginOrApplication'
import { EAccountRole, IPortalUser, ITokenAuth } from '../internal/models/Account'
import { EGlobalZIndex } from '../types/Constants'
import { AppInstance } from './appContainer/AppContext'
import { LoadingOverlay } from '../views/components/Modal'
import { IAppLoading } from '../types/GenericTypes'
import UnsupportedViewModal from '../views/components/modal/UnsupportedViewModal'
import SettingsStateManager from '../internal/state/SettingsStateManager'
import ToastNotifications from './appContainer/ToastNotifications'
import { AddWindowListeners, RemoveWindowListeners } from '../internal/browser/WindowEventListeners'
import DisplayManager from '../internal/browser/DisplayManager'
import { ThemedAppContainer } from '../views/components/view/Containers'
import PortalLogger from '../internal/PortalLogger'
import SessionHasExpiredModal from '../views/components/modal/SessionHasExpiredModal'
import Core from '../internal/Core'
import CookieManager from '../controllers/CookieManager'

Core.register()

export default function AppContainer() {
  const [currentUser, setCurrentUser] = useState<IPortalUser | null>(null)
  const [isLoading, setIsLoading] = useState<IAppLoading>({ initial: false, extended: false })
  const [sessionExpired, setSessionExpired] = useState(false)
  const cookies = CookieManager()
  const displayManager = DisplayManager()
  const settingsManager = SettingsStateManager()
  const api = new ApiController(currentUser)
    .onUpdateAuth(updateAuth)
    .onAuthError(onApiAuthError)

  const logger = new PortalLogger(api, currentUser)
  const isAdmin = currentUser?.role === EAccountRole.ADMIN

  useEffect(() => {
    AddWindowListeners()

    return () => {
      RemoveWindowListeners()
    }
  }, [])

  function updateAuth(auth: ITokenAuth) {
    setCurrentUser({ ...currentUser!, ...auth })
  }

  function onApiAuthError(error: string) {
    setSessionExpired(true)
  }

  async function logout() {
    runBlocking(async () => {
      await api.auth.logout(currentUser!.refresh_token)
      cookies.clearRefreshToken()
      window.location.reload()
    })
  }

  async function runBlocking(operation: () => Promise<void>) {
    setIsLoading({ initial: true, extended: false })
    // overlay is invisible if operation takes less than 1 second
    const handle = setTimeout(
      () => setIsLoading({ initial: true, extended: true }),
      500
    )
    try {
      await operation()
    } catch (error) {
      console.error('[runBlocking] operation failed:', error)
    }
    clearTimeout(handle)
    setIsLoading({ initial: false, extended: false })
  }

  const contextObj = {
    currentUser,
    setCurrentUser,
    isAdmin,
    settingsManager,
    displayManager,
    cookies,
    api,
    runBlocking,
    logout,
    logger,
    sessionExpired
  }

  return (
    <AppInstance.Provider value={contextObj}>
      <ThemedAppContainer>
        <LoginOrApplication />
        <LoadingOverlay
          isActive={isLoading.initial}
          extended={isLoading.extended}
          setIsActive={() => setIsLoading({ initial: false, extended: false })}
          zIndex={EGlobalZIndex.LOADING_MODAL}
        />
        <UnsupportedViewModal />
        <SessionHasExpiredModal />
      </ThemedAppContainer>
      <ToastNotifications />
    </AppInstance.Provider>
  )
}