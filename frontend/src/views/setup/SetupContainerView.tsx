import React from 'react'
import { FlexBox } from '../components/view/FlexLayouts'
import { BorderRadius, Colors } from '../../theme/Theme'
import { RChildren } from '../../types/GenericTypes'
import { VerticalSpacer } from '../components/ViewElements'
import PortalEnvironment from '../../internal/PortalEnvironment'
import LocalImages from '../images/LocalImages'
import { Text24 } from '../../theme/CustomText'

interface ISetupContainerViewProps extends RChildren {
  title: string,
  current: number,
}

export default function SetupContainerView(props: ISetupContainerViewProps) {
  const { title, current, children } = props

  return (
    <FlexBox>
      <FlexBox
        vertical
        margin={25}
        justify={'center'}
      >
        <FlexBox
          style={{
            background: Colors.DARK_00,
            borderRadius: BorderRadius.r10,
            padding: 25,
            maxWidth: 1000,
            overflow: 'auto'
          }}
        >
          <FlexBox vertical={true} style={{ minWidth: 400 }}>
            <FlexBox>
              <img
                src={LocalImages.BANNER_LOGO}
                alt={'banner'}
                style={{
                  maxWidth: 150,
                  marginTop: -20,
                  borderBottom: '1px solid white'
                }}
              />
            </FlexBox>
            <VerticalSpacer size={15} />
            <Text24 text={title} />
            <VerticalSpacer size={20} />

            {children}

            <VerticalSpacer size={25} />
            <SequenceProgressDots max={5} current={current} />
          </FlexBox>
        </FlexBox>
        <VerticalSpacer size={25} />
        <FlexBox>
          <text
            style={{
              color: Colors.LIGHT_GREY_00,
              fontSize: 14
            }}
          >Having trouble? <a
            href={`${PortalEnvironment.hostname()}/support-request`}
            target="_blank"
          >Contact Support</a>
          </text>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

type TSequencePositionProps = {
  current: number,
  max: number
}
const SequenceProgressDots = ({max, current}: TSequencePositionProps) => {
  if (max <= 1) {
    return null
  }

  return (
    <FlexBox justify={"center"}>
      {[...Array(max).keys()].map((num) => {
        const curIndex = current - 1
        const color = curIndex >= num ?
          Colors.GREEN : Colors.LIGHT_GREY_00

        return (
          <span style={{
            width: 5,
            height: 5,
            borderRadius: 5,
            margin: "10px 20px",
            background: color
          }} />
        )
      })}
    </FlexBox>
  )
}