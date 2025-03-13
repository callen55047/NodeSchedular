import { FlexBox } from '../../views/components/view/FlexLayouts'
import { BaseText } from '../../theme/CustomText'
import { HorizontalSpacer, Icon } from '../../views/components/ViewElements'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../theme/Theme'

let _challengeTimerHandle = -1

type TCheckBoxProps = {
  checked: boolean,
  onChange: (newValue: boolean) => void
}
export default function VerifyChallenge(props: TCheckBoxProps) {
  const [isReady, setIsReady] = useState(false)
  const { onChange, checked } = props

  useEffect(() => {
    _challengeTimerHandle = setTimeout(() => {
      setIsReady(true)
    }, 10000)

    return () => {
      clearTimeout(_challengeTimerHandle)
    }
  }, [])

  return (
    <FlexBox
      justify={'flex-start'}
      margin={5}
      style={{
        transition: 'all 0.5s ease-in-out'
      }}
    >
      <BaseText text={"Verify information"} size={18} alignment={"center"} />
      <HorizontalSpacer size={20} />
      {isReady ?
        <input
          checked={checked}
          type={'checkbox'}
          style={{
            width: 20,
            height: 20
          }}
          onChange={(e) => onChange(e.target.checked)}
        />
        :
        <Icon
          name={'fa-gear fa-spin'}
          margin={0}
          color={Colors.OFF_WHITE}
          rSize={2}
        />
      }

    </FlexBox>
  )
}