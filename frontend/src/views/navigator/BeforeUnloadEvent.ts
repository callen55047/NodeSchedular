import { INavigatorView } from './INavigatorView'

interface IBeforeNavigatorUnload {
  hasViewSpecificWork: boolean,
  modalIsActive: boolean,
  requestedView: INavigatorView | null
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
    console.log('staying on page', e)
  } else {
    e.preventDefault()
  }
}

function SetWarningForLeavingPage(active: boolean) {
  if (active) {
    window.addEventListener('beforeunload', handleBeforeUnload)
  } else {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}

export {
  IBeforeNavigatorUnload,
  SetWarningForLeavingPage
}