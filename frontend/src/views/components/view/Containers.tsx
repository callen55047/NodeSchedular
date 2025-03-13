import React from 'react'
import { RChildren } from '../../../types/GenericTypes'

const ThemedAppContainer = (props: RChildren) => {
  return (
    <div className="main-app-container theme-background">
      {props.children}
    </div>
  )
}

export {
  ThemedAppContainer
}