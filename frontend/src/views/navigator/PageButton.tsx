import React from 'react'
import { Colors } from '../../theme/Theme'
import { Icon } from '../components/ViewElements'
import { INavNotification } from './NavNotifications'
import { BaseText } from '../../theme/CustomText'

type TPageButtonProps = {
  page: string,
  icon: string,
  notification: INavNotification,
  isSelected: boolean,
  onSelected: () => void
}
export default function PageButton(props: TPageButtonProps) {
  const { page, icon, notification, isSelected, onSelected } = props
  const selectedStyle = isSelected ? 'nSelected' : ''

  return <div
    key={`key-${page}`}
    className={`nButton ${selectedStyle}`}
    style={{
      textAlign: 'center',
      padding: '25px',
      background: isSelected ? Colors.DARK_GREY : undefined,
      boxShadow: isSelected ? '#121212 1px 0px 4px 2px inset' : undefined,
      transition: 'all 0.2s',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
    onClick={onSelected}
  >

    <Icon
      name={icon}
      color={isSelected ? Colors.RED_00 : Colors.OFF_WHITE}
      rSize={1.5}
      margin={0}
    />
    <BaseText
      text={page}
      size={12}
      alignment={'center'}
      styles={{
        display: isSelected ? 'block' : 'none',
        opacity: isSelected ? 0.6 : 0.0,
        bottom: 6,
        position: 'absolute',
    }}
    />
    {notification.count > 0 &&
      <span style={{
        width: 15,
        height: 15,
        borderRadius: 15,
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        background: 'red',
        boxShadow: '0px 0px 2px 2px red',
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
      }}>
        {notification.count}
      </span>
    }
  </div>
}