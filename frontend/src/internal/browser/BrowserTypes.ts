const BrowserTypes = {

  Embedded: {
    instagram: 'Instagram'
  },

  shouldIgnore: (): boolean => {
    const userAgent = navigator.userAgent.toLowerCase()
    const botKeywords = /bot|crawler|ad/

    return botKeywords.test(userAgent)
  }

}

export default BrowserTypes