const WindowLocation = {

  newTab: (url: string) => {
    const newTab = window.open(url, '_blank')
    if (newTab) {
      newTab.focus()
    } else {
      console.warn('Opening a new tab was blocked by the browser.')
    }
  }

}

export default WindowLocation