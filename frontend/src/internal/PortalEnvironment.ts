const PortalEnvironment = {

  isProduction: (): boolean => {
    const hostname = window.location.hostname
    return (hostname !== 'localhost' && hostname !== '127.0.0.1')
  },

  hostname: (): string => {
    return PortalEnvironment.isProduction() ?
      'https://domain.com' : 'http://localhost:8080'
  }
}

export default PortalEnvironment