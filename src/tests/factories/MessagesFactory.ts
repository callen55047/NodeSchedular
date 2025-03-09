const MessagesFactory = {

  generateRandomString: (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const stringLength = Math.floor(Math.random() * 21) + 10 // Random length between 10 and 30

    let randomString = ''
    for (let i = 0; i < stringLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomString += characters.charAt(randomIndex)
    }

    return randomString
  }
}

export default MessagesFactory