import React, { useContext, useEffect, useState } from 'react'
import { FlexBox } from '../components/view/FlexLayouts'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { BaseText } from '../../theme/CustomText'
import { HorizontalSpacer, Icon, VerticalSpacer } from '../components/ViewElements'
import { Colors } from '../../theme/Theme'
import { NavContext } from '../navigator/NavContext'
import { EMetaType } from '../../internal/models/File'
import { ApiContract } from '../../contracts/ApiContract'

let _verifyStripeDashboardTask: ApiContract.Response.StripeAccountVerify | null = null

export default function DashboardOnboardingStatus() {
  const { currentUser, api } = useContext(AppInstance)
  const { fileManager } = useContext(NavContext)
  const [stripeComplete, setStripeComplete] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    verifyStripeSetup()

    return () => {
      _verifyStripeDashboardTask = null
    }
  }, [currentUser?.stripe_id])

  async function verifyStripeSetup() {
    _verifyStripeDashboardTask = await api.stripe.accountVerify()
    setStripeComplete(
      _verifyStripeDashboardTask?.charges_enabled &&
      _verifyStripeDashboardTask?.details_submitted &&
      _verifyStripeDashboardTask?.payouts_enabled
    )
  }

  const infoComplete =
    !!currentUser?.first_name &&
    !!currentUser?.last_name &&
    !!currentUser?.phone_number
  const addressComplete =
    !!currentUser?.address?.coordinates?.lat &&
    !!currentUser?.address?.coordinates?.lng
  const storeFrontSetup = fileManager.getFilesByType(EMetaType.STOREFRONT).length > 2

  return (
    <FlexBox vertical={true}>

      <OnboardingItem
        name={'Person / Contact information'}
        complete={infoComplete}
        description={
          'You must provide your legal first and last name, and your phone number. ' +
          'This can be completed in the Profile tab.'
        }
      />

      <OnboardingItem
        name={'Valid BC Address'}
        complete={addressComplete}
        description={
          'You need a valid shop address in British Columbia. ' +
          'This can be completed in the Profile tab.'
        }
      />

      <OnboardingItem
        name={'Storefront images'}
        complete={storeFrontSetup}
        description={
          'Clients need to see what you are about! Upload at least 3 storefront images for ' +
          'clients on the platform to see when viewing your profile. This can be completed in the Profile tab.'
        }
      />

      <OnboardingItem
        name={'Payments with Stripe'}
        complete={stripeComplete}
        description={
          'In order to get paid, you need to complete your Stripe account setup. ' +
          'This can be completed in the Settings tab.'
        }
      />

    </FlexBox>
  )
}

interface IOnboardingItemProps {
  name: string,
  complete?: boolean,
  description: string
}

const OnboardingItem = (props: IOnboardingItemProps) => {
  const { name, complete, description } = props

  const statusText = complete ? 'Completed' : 'Incomplete'
  const statusColor = complete ? Colors.GREEN : Colors.RED_00
  return (
    <>
      <FlexBox vertical={true}>
        <BaseText size={24} text={name} styles={{ fontWeight: 'bold' }} />
        <VerticalSpacer size={5} />
        <FlexBox justify={'flex-start'}>
          {complete === undefined ?
            <Icon name={'fa-gear fa-spin'} margin={0} />
            :
            <>
              <BaseText text={statusText} color={statusColor} />
              <HorizontalSpacer size={5} />
              {!complete &&
                <BaseText text={`- ${description}`} color={Colors.LIGHT_GREY_00} />
              }
            </>
          }
        </FlexBox>
      </FlexBox>
      <VerticalSpacer size={20} />
    </>
  )
}