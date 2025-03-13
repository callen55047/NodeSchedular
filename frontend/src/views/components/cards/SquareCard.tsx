import React from 'react'
import { BorderRadius, Colors } from '../../../theme/Theme'
import { Icon } from '../ViewElements'
import { BaseText } from '../../../theme/CustomText'
import { FlexBox } from '../view/FlexLayouts'
import { IFile } from '../../../internal/models/File'

interface ISquareCardProps {
  title: string,
  isActive?: boolean,
  background?: IFile | null,
  color?: string,
  icon?: string,
  onClick: () => void
}
const SquareCard = (props: ISquareCardProps) => {
  const { icon, title, isActive, background, color, onClick } = props

  return (
    <div
      className={'simple-hover'}
      style={{
        position: 'relative',
        borderRadius: BorderRadius.r10,
        boxShadow: isActive ? `0px 0px 3px 4px ${Colors.BLUE_00}` : undefined,
        overflow: 'clip',
        background: `linear-gradient(to bottom, ${color || 'red'}, ${Colors.DARK_GREY})`,
        textAlign: 'center',
        width: 125,
        height: 125
      }}
      onClick={onClick}
    >
      <FlexBox
        vertical={true}
        style={{
          height: '100%'
        }}
      >
        {background ?
          <img
            src={background.url}
            alt={'background-card-image'}
            style={{
              objectFit: 'cover',
              height: '100%'
            }}
          />
          :
          <Icon
            name={icon || 'fa-file'}
            rSize={3}
            margin={0}
            color={Colors.DARK_00}
          />
        }
      </FlexBox>

      <div
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          zIndex: 1,
          background: 'rgba(39,39,39,0.56)',
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        <BaseText
          text={title}
          styles={{
            margin: 5,
            fontWeight: 'bold'
          }}
        />
      </div>
    </div>
  )
}

export default SquareCard