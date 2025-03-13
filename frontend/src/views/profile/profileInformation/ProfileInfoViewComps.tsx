import { FlexBox } from '../../components/view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { HorizontalSpacer, Icon } from '../../components/ViewElements'
import { BorderRadius, Colors } from '../../../theme/Theme'
import React from 'react'

const ProfileAddressVerification = ({ verified }: { verified: boolean }) => {
  const text = verified ? 'Address Verified' : 'Unknown Address'

  return (
    <FlexBox
      flexBias={1}
      justify={'center'}
      style={{
        background: verified ? Colors.GREEN : 'transparent',
        border: `1px solid ${verified ? Colors.MONEY_GREEN : Colors.RED_00}`,
        borderRadius: BorderRadius.r4,
        minWidth: '45%',
        margin: '25px 10px 5px'
      }}
    >
      <BaseText text={text} size={16} alignment={'center'} />
      <HorizontalSpacer size={10} />
      <Icon
        name={verified ? 'fa-check-circle-o' : 'fa-times'}
        color={verified ? Colors.MONEY_GREEN : Colors.RED_00}
        margin={0}
        rSize={1.5}
      />
    </FlexBox>
  )
}

export {
  ProfileAddressVerification,
}