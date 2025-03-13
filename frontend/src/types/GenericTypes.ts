import { ReactNode } from 'react'

type RChildren = {
  children: ReactNode
}

type IAppLoading = {
  initial: boolean,
  extended: boolean
}


function getBooleanDisplayName(value: boolean): string {
  return value ? 'Yes' : 'No'
}

function getNameBooleanValue(name: string): boolean {
  return name === 'Yes'
}

export {
  RChildren,
  IAppLoading,
  getNameBooleanValue,
  getBooleanDisplayName
}