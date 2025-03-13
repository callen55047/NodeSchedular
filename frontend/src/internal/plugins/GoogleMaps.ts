import { detailedAddress, IAddress, ICoordinates } from '../models/shared/Address'
import axios from 'axios'
import PortalConfig from '../PortalConfig'

const _validCountries = ['Canada']

const GoogleMaps = {

  isCountryValid: (addressComponents: any): boolean => {
    const countryComponent = addressComponents.find((component: any) => component.types.includes('country'))
    return _validCountries.includes(countryComponent.long_name)
  },

  getCoordinatesFor: async (address: IAddress): Promise<ICoordinates | string> => {
    const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: detailedAddress(address),
        key: PortalConfig.GOOGLE_API_LICENSE
      }
    })

    if (res.data) {
      if (res.data.results.length < 1) {
        return "Unknown address"
      }

      const results = res.data.results[0]
      if (!GoogleMaps.isCountryValid(results.address_components)) {
        return "Country not valid"
      }

      const location = results.geometry.location
      return {
        lat: location.lat,
        lng: location.lng
      }
    }

    return "Network offline"
  }
}

export default GoogleMaps