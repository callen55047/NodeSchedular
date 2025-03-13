import { BaseText } from '../../theme/CustomText'
import React from 'react'

const AdminPageHeading = ({ text }: { text: string }) => {
  return (
    <BaseText text={text} size={20} styles={{ fontWeight: 'bold' }} />
  )
}

export {
  AdminPageHeading
}