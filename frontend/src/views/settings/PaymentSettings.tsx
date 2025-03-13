import React, { useContext, useEffect, useState } from 'react'
import { Tile, TileHeadingAndSub, TileRowContainer } from '../components/TileLayout'
import { HorizontalSpacer, Icon, VerticalSpacer } from '../components/ViewElements'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { FlexBox } from '../components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { Colors } from '../../theme/Theme'
import { SimpleButton } from '../components/Buttons'
import { ApiContract } from '../../contracts/ApiContract'
import { SequenceContext } from '../../appEntry/sequenceController/SequenceContext'
import { SectionBody, SectionHeading } from './SettingsViewComps'

let _asyncAccountInfoTask: ApiContract.Response.StripeAccountVerify | null = null

export default function PaymentSettings() {
  const { api } = useContext(AppInstance)
  const { goToStep } = useContext(SequenceContext)
  const [isLoading, setIsLoading] = useState(false)
  const [stripeDetails, setStripeDetails] =
    useState<ApiContract.Response.StripeAccountVerify>({} as ApiContract.Response.StripeAccountVerify)

  const needsSetup = !stripeDetails.charges_enabled || !stripeDetails.details_submitted
  const detailsIcon = getIconAndColor(stripeDetails.details_submitted)
  const chargesIcon = getIconAndColor(stripeDetails.charges_enabled)
  const payoutsIcon = getIconAndColor(stripeDetails.payouts_enabled)

  useEffect(() => {
    refreshStatus()

    return () => {
      _asyncAccountInfoTask = null
    }
  }, [])

  async function refreshStatus() {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    _asyncAccountInfoTask = await api.stripe.accountVerify()
    if (_asyncAccountInfoTask) {
      setStripeDetails(_asyncAccountInfoTask)
    }
    setIsLoading(false)
  }

  function getIconAndColor(condition: boolean): { icon: string, color: string } {
    const icon = isLoading ?
      'fa-refresh fa-spin' :
      condition ?
        'fa-check' : 'fa-times'
    const color = isLoading ?
      Colors.OFF_WHITE :
      condition ?
        Colors.GREEN : Colors.RED_00

    return { icon, color }
  }

  function goToStripeAccount() {
    if (stripeDetails.login_url) {
      const newTab = window.open(stripeDetails.login_url, '_blank')
      if (newTab) {
        newTab.focus()
      } else {
        console.warn('Opening a new tab was blocked by the browser.')
      }
    }
  }

  return (
    <TileRowContainer>
      <Tile>
        <TileHeadingAndSub
          title={'Payment'}
          sub={'View status and open Stripe account page'}
        />
        <VerticalSpacer size={30} />
        <FlexBox vertical={true}>
          <SectionHeading name={'Stripe Account Status'} />
          <FlexBox justify={'flex-start'}>
            <FlexBox vertical={true}>
              <SectionBody text={'Details submitted'} />
              <VerticalSpacer size={10} />
              <SectionBody text={'Charges enabled'} />
              <VerticalSpacer size={10} />
              <SectionBody text={'Payouts enabled'} />
            </FlexBox>
            <HorizontalSpacer size={20} />
            <FlexBox vertical={true}>
              <Icon
                name={detailsIcon.icon}
                color={detailsIcon.color}
                margin={0}
              />
              <VerticalSpacer size={10} />
              <Icon
                name={chargesIcon.icon}
                color={chargesIcon.color}
                margin={0}
              />
              <VerticalSpacer size={10} />
              <Icon
                name={payoutsIcon.icon}
                color={payoutsIcon.color}
                margin={0}
              />
            </FlexBox>
          </FlexBox>
          <VerticalSpacer size={30} />

          <BaseText text={'Account Links'} size={18} styles={{ fontWeight: 'bold' }} />
          <VerticalSpacer size={10} />
          {needsSetup ?
            <FlexBox justify={'flex-start'}>
              <SimpleButton
                theme={"PRIMARY"}
                text={'Launch setup'}
                action={() => goToStep('STRIPE_ACCOUNT')}
              />
              <HorizontalSpacer size={15} />
              <SimpleButton
                theme={'SECONDARY'}
                text={'Refresh'}
                action={refreshStatus}
              />
            </FlexBox>
            :
            <FlexBox justify={'flex-start'}>
              <SimpleButton
                theme={'PRIMARY'}
                text={'Open Stripe Dashboard'}
                action={goToStripeAccount}
              />
            </FlexBox>
          }
        </FlexBox>
      </Tile>
    </TileRowContainer>
  )
}