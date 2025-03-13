interface ICoordinates {
  lat: number,
  lng: number
}

interface IAddress {
  street: string,
  city: string,
  province_state: string,
  postal_zip: string,
  country: string,
  coordinates: ICoordinates | null
}

function simplifiedAddress(address?: IAddress | null): string {
  if (!address) {
    return ''
  }
  const province = address.province_state ? `, ${address.province_state}` : ''
  return `${address.city}${province}`
}

function detailedAddress(address?: IAddress | null): string {
  if (!address) {
    return ''
  }
  const country = address.country ? `, ${address.country}` : ''
  return `${address.street} ${simplifiedAddress(address)}${country}`
}

export {
  ICoordinates,
  IAddress,
  simplifiedAddress,
  detailedAddress
}