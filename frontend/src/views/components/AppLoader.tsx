import React from 'react'
import LocalImages from '../images/LocalImages'
import { BorderRadius } from '../../theme/Theme'

export default function AppLoader() {
  return (
    <div className={'theme-background'}
         style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div>
          <img
            src={LocalImages.APP_ICON}
            style={{
              height: 120,
              borderRadius: BorderRadius.r4
            }}
            alt={'alt'}
          />
        </div>
      </div>
    </div>
  )
}