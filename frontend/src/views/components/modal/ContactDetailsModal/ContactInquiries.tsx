import React, { useContext } from 'react'
import { IAccount } from '../../../../internal/models/Account'
import { FlexBox } from '../../view/FlexLayouts'
import { NavContext } from '../../../navigator/NavContext'
import { Colors } from '../../../../theme/Theme'
import FromUtcDate from '../../../../internal/DateAndTime'
import { BaseText } from '../../../../theme/CustomText'
import { VerticalContentDivider, VerticalSpacer } from '../../ViewElements'
import HorizontalFilesDisplay from '../../images/HorizontalFilesDisplay'
import { BaseTable } from '../../Tables'
import { orderByCreatedAt } from '../../../../internal/ObjectHelpers'
import ContactDetailsContainer from './ContactDetailsContainer'

interface IContactInquiriesProps {
  contact: IAccount
}

export default function ContactInquiries(props: IContactInquiriesProps) {
  const { inquiries } = useContext(NavContext)
  const { contact } = props

  const contactInquiries = inquiries.filter((i) => i.user_id === contact._id)
  const orderedInquiries = orderByCreatedAt(contactInquiries).reverse()

  return (
    <>
      {orderedInquiries.map((inquiry) => {
        return (
          <ContactDetailsContainer>
            <FlexBox justify={'space-between'}>
              <BaseText
                text={FromUtcDate(inquiry.created_at).weekdayString()}
                color={Colors.MONEY_GREEN}
                alignment={'center'}
              />
              <BaseText text={inquiry.status} size={20} styles={{ fontWeight: 'bold' }} />
            </FlexBox>
            <VerticalContentDivider fullWidth />

            <BaseTable
              head={<></>}
              body={
                <>
                  <tr>
                    <td>Budget</td>
                    <td>{inquiry.budget}</td>
                  </tr>
                  <tr>
                    <td>Timeline</td>
                    <td>{inquiry.timeline}</td>
                  </tr>
                  <tr>
                    <td>Body Location</td>
                    <td>{inquiry.body_location}</td>
                  </tr>
                  <tr>
                    <td>Size</td>
                    <td>{inquiry.size}</td>
                  </tr>
                  <tr>
                    <td>Work on Existing Tattoo</td>
                    <td>{`${inquiry.working_on_existing_tattoo}`}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{inquiry.description}</td>
                  </tr>
                  {inquiry.fields.map((f) => {
                    return (
                      <tr>
                        <td>{f.field}</td>
                        <td>{f.value}</td>
                      </tr>
                    )
                  })}
                </>
              }
            />
            <VerticalSpacer size={5} />

            <HorizontalFilesDisplay
              files={inquiry.attachments}
              width={50}
              title={'Attachments'}
            />

          </ContactDetailsContainer>
        )
      })}
    </>
  )
}