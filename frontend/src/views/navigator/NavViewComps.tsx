import React, { useContext } from 'react'
import { Colors, Dimensions } from '../../theme/Theme'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import PageButton from './PageButton'
import { RChildren } from '../../types/GenericTypes'
import { NavContext } from './NavContext'
import { INavigatorView, NAVIGATOR_VIEWS } from './INavigatorView'

const NavContainer = ({ children }: RChildren) => {
  return <div className="navigator-main" style={{ width: '100%' }}>
    {children}
  </div>
}

const NavBodyContainer = ({ children }: RChildren) => {
  return <div className={'navigator-body'} style={{ display: 'flex', height: Dimensions.NAV_BODY_HEIGHT }}>
    {children}
  </div>
}

type TNavButtonMenuProps = {
  currentView: INavigatorView,
  setNewComponent: (newComp: INavigatorView) => void
}
const NavButtonMenu = (props: TNavButtonMenuProps) => {
  const { isAdmin } = useContext(AppInstance)
  const { getNotifications } = useContext(NavContext)
  const { currentView, setNewComponent } = props

  return (
    <div
      className={'navigator-menu'}
      style={{
        background: Colors.DARK_00,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: Dimensions.NAV_SIDEBAR_WIDTH,
        transition: 'all 0.5s ease'
      }}>
      {Object.values(NAVIGATOR_VIEWS).map((value) => {
        if (value === NAVIGATOR_VIEWS.ADMIN && !isAdmin) {
          return null
        }

        return <PageButton
          page={value.name}
          icon={value.icon}
          notification={getNotifications(value)}
          isSelected={currentView.name === value.name}
          onSelected={() => setNewComponent(value)}
        />
      })}
    </div>
  )
}

const NavScrollableContainer = ({ children }: RChildren) => {
  return <div className="navigator-subview scroll-view"
              style={{
                flex: 5,
                margin: '15px 15px 0'
              }}>{children}</div>
}

export {
  NavContainer,
  NavBodyContainer,
  NavButtonMenu,
  NavScrollableContainer
}