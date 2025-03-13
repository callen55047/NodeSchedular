import React, { useContext } from 'react'
import SetupContainerView from '../SetupContainerView'
import { BaseText } from '../../../theme/CustomText'
import { Icon, VerticalSpacer } from '../../components/ViewElements'
import { FlexBox } from '../../components/view/FlexLayouts'
import { Colors } from '../../../theme/Theme'
import { BaseTable } from '../../components/Tables'
import AsyncStateFetch from '../../../internal/state/AsyncStateFetch'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { SimpleButton } from '../../components/Buttons'
import { toast } from 'react-toastify'
import PortalEnvironment from '../../../internal/PortalEnvironment'

export default function StripeOnboarding() {
  const { api, runBlocking } = useContext(AppInstance)
  const verifyTask = AsyncStateFetch(() => api.stripe.accountVerify())

  const isComplete =
    (verifyTask.data?.charges_enabled || false) &&
    (verifyTask.data?.details_submitted || false)

  function createStripeAccount() {
    runBlocking(async () => {
      const res = await api.stripe.createExpressOnboardingAccount()
      if (res) {
        window.location.href = res.stripe_setup_url
      } else {
        toast.error('failed to get setup url from stripe.')
      }
    })
  }

  function completeStep() {
    runBlocking(async () => {
      await api.event.artistOnboarded()
      // strip url parameters from stripe return
      window.location.href = `${PortalEnvironment.hostname()}/portal`
    })
  }

  return (
    <SetupContainerView current={5} title={'Stripe Account Setup'}>
      <BaseText
        text={'We partner with Stripe to make online payments easy.'}
        color={Colors.LIGHT_GREY_00}
      />
      <VerticalSpacer size={15} />

      <BaseTable
        head={
          <tr>
            <td>Feature</td>
            <td>Is Enabled</td>
          </tr>
        }
        body={
          <>
            <tr>
              <td>
                Details Submitted
              </td>
              <td>
                {verifyTask.data &&
                  <Icon
                    name={verifyTask.data.details_submitted ? 'fa-check' : 'fa-times'}
                    color={verifyTask.data.details_submitted ? Colors.GREEN : Colors.RED_00}
                    margin={0}
                  />
                }
              </td>
            </tr>
            <tr>
              <td>
                Charges Enabled
              </td>
              <td>
                {verifyTask.data &&
                  <Icon
                    name={verifyTask.data.charges_enabled ? 'fa-check' : 'fa-times'}
                    color={verifyTask.data.charges_enabled ? Colors.GREEN : Colors.RED_00}
                    margin={0}
                  />
                }
              </td>
            </tr>
          </>
        }
      />
      <VerticalSpacer size={15} />

      {verifyTask.data &&
        <>
          <BaseText
            text={
              isComplete ?
                'You\'re good to go!' :
                'To setup Stripe, click the button below to get continue'
            }
            color={Colors.LIGHT_GREY_00}
          />
          <VerticalSpacer size={15} />
          <FlexBox>
            {isComplete ?
              <SimpleButton
                theme={'SUCCESS'}
                text={'Continue'}
                action={completeStep}
              />
              :
              <SimpleButton
                theme={'PRIMARY'}
                text={'Open Stripe'}
                action={createStripeAccount}
              />
            }
          </FlexBox>
        </>
      }
    </SetupContainerView>
  )
}