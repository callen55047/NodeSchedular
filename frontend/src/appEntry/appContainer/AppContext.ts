import {IPortalUser} from "../../internal/models/Account";
import React, {createContext} from "react";
import ApiController from "../../controllers/ApiController";
import { ISettingsStateManager } from '../../internal/state/SettingsStateManager'
import { IDisplayManager } from '../../internal/browser/DisplayManager'
import PortalLogger from '../../internal/PortalLogger'
import { ICookieManager } from '../../controllers/CookieManager'

interface IAppInstance {
    currentUser: IPortalUser | null,
    setCurrentUser: React.Dispatch<React.SetStateAction<IPortalUser | null>>,
    isAdmin: boolean,
    settingsManager: ISettingsStateManager,
    displayManager: IDisplayManager,
    cookies: ICookieManager,
    api: ApiController,
    runBlocking: (operation: () => Promise<void>) => void,
    logout: () => void,
    logger: PortalLogger,
    sessionExpired: boolean
}

export const AppInstance = createContext<IAppInstance>({} as IAppInstance);