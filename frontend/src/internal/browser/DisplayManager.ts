import { useEffect, useState } from 'react'

interface IDisplayManager {
  isTabletView: boolean,
  isMobileView: boolean
}

const DisplayManager = (): IDisplayManager => {
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    const checkIsMobile = () => {
      setScreenWidth(window.innerWidth)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  return {

    isTabletView: screenWidth <= 1200,

    isMobileView: screenWidth <= 768

  }
}

export default DisplayManager

export {
  IDisplayManager
}