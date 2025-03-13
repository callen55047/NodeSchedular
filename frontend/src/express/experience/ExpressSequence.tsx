import React, { useContext, useEffect, useState } from 'react'
import { ExpressContext } from './ExpressContext'
import AppLoader from '../../views/components/AppLoader'
import NoArtistFoundView from '../views/NoArtistFoundView'

export default function ExpressSequence() {
  const { user, setUser, artist, setArtist, cookies, api } = useContext(ExpressContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserFromToken()
    loadArtistFromUrlParam()
  }, [])

  async function loadUserFromToken() {
    const refresh_token = cookies.getRefreshToken()
    const data = await api.auth.refreshAccessToken(refresh_token)
    if (data?.access_token) {
      const user = await api.account.loadPortalUser({
        access_token: data.access_token,
        refresh_token
      })

      if (user) {
        cookies.setRefreshToken(user.refresh_token)
        setUser({ ...user })
      }
    } else {
      cookies.clearRefreshToken()
    }
  }

  async function loadArtistFromUrlParam() {

  }

  if (isLoading) {
    return <AppLoader />
  }

  if (artist == null) {
    return <NoArtistFoundView />
  }

  return (
    <div/>
  )
}