import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { InvisibleChildWrapper } from './modal/ModalViewComps'
import { RChildren } from '../../types/GenericTypes'
import { BorderRadius, Colors } from '../../theme/Theme'
import { EGlobalZIndex } from '../../types/Constants'

interface IPopoverProps extends RChildren {
  content: ReactNode,
  autoClose?: boolean
  minWidth?: number
}

export default function Popover(props: IPopoverProps) {
  const { children, content, autoClose, minWidth } = props
  const [isActive, setIsActive] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseClick)
    return () => {
      document.removeEventListener('mousedown', handleMouseClick)
    }
  }, [dropdownRef])

  const handleMouseClick = (event: any) => {
    // TODO: function does not reference current state of popover
    if (dropdownRef.current && isActive) {
      const bounds = dropdownRef.current.getBoundingClientRect()
      if ((event.clientX >= bounds.left && event.clientX <= bounds.right &&
        event.clientY >= bounds.top || event.clientY <= bounds.bottom)) {
        closeMenu()
      }
    }
  }

  function closeMenu() {
    setIsActive(false)
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'inherit',
        pointerEvents: 'all'
      }}
    >
      <InvisibleChildWrapper onClick={() => setIsActive(!isActive)}>
        {children}
      </InvisibleChildWrapper>

      <div
        id={'popover-content-wrapper'}
        onClick={autoClose ? closeMenu : undefined}
        ref={dropdownRef}
        style={{
          display: isActive ? 'block' : 'none',
          zIndex: EGlobalZIndex.POPOVER,
          position: 'absolute',
          top: 50,
          backgroundColor: Colors.LIGHT_GREY_00,
          border: `2px solid ${Colors.DARK_GREY}`,
          borderRadius: BorderRadius.r10,
          padding: 10,
          minWidth: minWidth || 200,
          overflow: 'clip'
        }}>
        {content}
      </div>
    </div>
  )
}

