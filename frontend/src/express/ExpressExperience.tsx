import React, { useState } from 'react'
import { ThemedAppContainer } from '../views/components/view/Containers'
import { ExpressContext } from './experience/ExpressContext'
import { IAccount, IPortalUser } from '../internal/models/Account'
import ApiController from '../controllers/ApiController'
import CookieManager from '../controllers/CookieManager'
import ExpressSequence from './experience/ExpressSequence'

/*
* Express experience acts as a simplified client application
* Clients can register and send inquiries.
* They are then routed to download the native app through either Google Play or AppStore
 */
export default function ExpressExperience() {
  const [user, setUser] = useState<IPortalUser | null>(null)
  const [artist, setArtist] = useState<IAccount | null>(null)
  const cookies = CookieManager()
  const api = new ApiController(user)

  async function runBlocking(operation: () => Promise<void>) {
    try {
      await operation()
    } catch (error) {
      console.error('[runBlocking] operation failed:', error)
    }
  }

  const value = {
    user,
    setUser,
    artist,
    setArtist,
    cookies,
    api,
    runBlocking
  }

  return (
    <ExpressContext.Provider value={value}>
      <ThemedAppContainer>
        <ExpressSequence />
      </ThemedAppContainer>
    </ExpressContext.Provider>
  )
}