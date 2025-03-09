import { ICoordinate } from '../models/shared/Address'

const GeoLocation = (origin: ICoordinate | null) => {
  const earthRadius = 6371e3

  function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  return {
    // distance in meters
    distanceTo: (target: ICoordinate | null): number | null => {
      if (!origin || !target) {
        return null
      }

      const lat1 = toRadians(origin.lat)
      const lat2 = toRadians(target.lat)
      const deltaLat = toRadians(target.lat - origin.lat)
      const deltaLng = toRadians(target.lng - origin.lng)

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      return earthRadius * c
    }
  }

}

export default GeoLocation