import React, { useContext } from 'react'
import { FlexBox } from '../../../components/view/FlexLayouts'
import { Colors } from '../../../../theme/Theme'
import { Icon } from '../../../components/ViewElements'
import { ArtistDetailContext } from './ArtistDetailContext'
import { detailedAddress } from '../../../../internal/models/shared/Address'
import { BaseTable } from '../../../components/Tables'
import FromUtcDate from '../../../../internal/DateAndTime'

export default function ArtistDetailInfoTab() {
  const { artist, details } = useContext(ArtistDetailContext)

  const infoComplete =
    !!artist.first_name &&
    !!artist.last_name &&
    !!artist.phone_number
  const addressComplete =
    !!artist.address?.coordinates?.lat &&
    !!artist.address?.coordinates?.lng

  return (
    <FlexBox
      vertical={true}
      justify={'flex-start'}
      style={{
        overflow: 'auto'
      }}
    >
      <BaseTable
        head={
          <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Verified</th>
          </tr>
        }
        body={
          <>
            <tr>
              <td>Phone</td>
              <td>{`${artist.phone_number}`}</td>
              <td><VerifiedCheck verified={infoComplete} /></td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{`${detailedAddress(artist.address)}`}</td>
              <td><VerifiedCheck verified={addressComplete} /></td>
            </tr>
            <tr>
              <td>Storefront Images</td>
              <td>{details.storeFrontImages.length}</td>
              <td><VerifiedCheck verified={details.storeFrontImages.length > 2} /></td>
            </tr>
            <tr>
              <td>Stripe ID</td>
              <td>{artist.stripe_id}</td>
              <td><VerifiedCheck verified={details.payments} /></td>
            </tr>
            <tr>
              <td>Followers</td>
              <td>{details.followers}</td>
              <td></td>
            </tr>
            {artist.deleted_at &&
              <tr>
                <td>Deleted at</td>
                <td>{FromUtcDate(artist.deleted_at).weekdayWithYearString()}</td>
                <td><VerifiedCheck verified={true} /></td>
              </tr>
            }
          </>
        }
      />
    </FlexBox>
  )
}

const VerifiedCheck = ({ verified }: { verified: boolean }) => {
  if (!verified) {
    return null
  }

  return (
    <Icon name={'fa-check'} color={Colors.GREEN} margin={0} rSize={1} />
  )
}
