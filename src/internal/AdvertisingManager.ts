import AppTraffic, { ETrafficSource } from '../models/AppTraffic.js'

const AdvertisingManager = {

  getLatestGroupName: async (): Promise<string | null> => {
    const latestTraffic = await AppTraffic
      .findOne({ source: ETrafficSource.PUBLIC_LINK })
      .sort({ created_at: -1 })
    return latestTraffic ? latestTraffic.group_name : null
  }

}

export default AdvertisingManager