import React, { useContext, useEffect } from 'react'
import SetupContainerView from '../SetupContainerView'
import { FlexBox } from '../../components/view/FlexLayouts'
import { Icon } from '../../components/ViewElements'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'

export default function SetupErrorView() {
  const { logger } = useContext(AppInstance)

  useEffect(() => {
    logger.error('[SetupErrorView] Unable to verify artist during onboarding sequence')
  }, [])

  return (
    <SetupContainerView title={'Something went wrong'} current={0}>
      <FlexBox>
        <Icon
        name={'fa-user-times'}
        rSize={3}
        />
      </FlexBox>
    </SetupContainerView>
  )
}