import { IAccount, IPortalUser } from '../../internal/models/Account'
import React, { createContext } from 'react'
import ApiController from '../../controllers/ApiController'
import { ICookieManager } from '../../controllers/CookieManager'

interface IExpressContext {
  user: IPortalUser | null,
  setUser: React.Dispatch<React.SetStateAction<IPortalUser | null>>,
  artist: IAccount | null,
  setArtist: React.Dispatch<React.SetStateAction<IAccount | null>>,
  cookies: ICookieManager,
  api: ApiController,
  runBlocking: (operation: () => Promise<void>) => void,
}

export const ExpressContext = createContext({} as IExpressContext)