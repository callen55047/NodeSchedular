import { IAccount } from '../../../../internal/models/Account'
import { ApiContract } from '../../../../contracts/ApiContract'
import { createContext } from 'react'

interface IArtistDetailContext {
  artist: IAccount,
  updateArtist: (artist: IAccount) => void,
  details: ApiContract.Response.ArtistDetails
}

export const ArtistDetailContext = createContext<IArtistDetailContext>({} as IArtistDetailContext)