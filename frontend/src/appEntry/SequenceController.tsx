import React, { useContext, useEffect, useState } from 'react'
import { SequenceContext, SequenceState } from './sequenceController/SequenceContext'
import VerifyEmail from '../views/setup/onboarding/VerifyEmail'
import Navigator from '../views/Navigator'
import { EAccountRole } from '../internal/models/Account'
import UrlParams from '../internal/browser/UrlParams'
import SetupErrorView from '../views/setup/onboarding/SetupErrorView'
import { AppInstance } from './appContainer/AppContext'
import AppLoader from '../views/components/AppLoader'
import StripeOnboarding from '../views/setup/onboarding/StripeOnboarding'
import BasicInfoOnboarding from '../views/setup/onboarding/BasicInfoOnboarding'
import AddressOnboarding from '../views/setup/onboarding/AddressOnboarding'
import MediaOnboarding from '../views/setup/onboarding/MediaOnboarding'

export default function SequenceController() {
  const { currentUser, api } = useContext(AppInstance)
  const [sequence, setSequence] = useState<SequenceState>('INIT')

  useEffect(() => {
    handleFirstView()
  }, [])

  async function handleFirstView() {
    if (UrlParams().isStripeReturn || UrlParams().isStripeRefresh) {
      // TODO: create refresh token call to log user back in
      setSequence('STRIPE_ACCOUNT')
      return
    }

    if (currentUser!.role === EAccountRole.ADMIN) {
      setSequence('DASHBOARD')
      return
    }

    const status = await api.account.verifyArtist(currentUser!._id)
    if (!status) {
      setSequence('ERROR')
      return
    }

    // 5 steps for successful onboarding
    if (!currentUser!.email_verified) {
      setSequence('VERIFY_EMAIL')
      return
    }

    if (!status.information) {
      setSequence('BASIC_INFO')
      return
    }

    // TODO: debug Alya artist errors
    // if (!status.address) {
    //   setSequence('ADDRESS')
    //   return
    // }

    if (!status.media) {
      setSequence('MEDIA')
      return
    }

    if (!status.payments) {
      setSequence('STRIPE_ACCOUNT')
      return
    }

    setSequence('DASHBOARD')
  }

  const contextObj = {
    goToStep: (state: SequenceState) => setSequence(state)
  }

  return (
    <SequenceContext.Provider value={contextObj}>
      <SequenceViewSwitch state={sequence} />
    </SequenceContext.Provider>
  )
}

const SequenceViewSwitch = ({ state }: { state: SequenceState }) => {
  switch (state) {
    case 'INIT':
      return <AppLoader />
    case 'VERIFY_EMAIL':
      return <VerifyEmail />
    case 'BASIC_INFO':
      return <BasicInfoOnboarding />
    case 'ADDRESS':
      return <AddressOnboarding />
    case 'MEDIA':
      return <MediaOnboarding />
    case 'STRIPE_ACCOUNT':
      return <StripeOnboarding />
    case 'DASHBOARD':
      return <Navigator />
    default:
      return <SetupErrorView />
  }
}