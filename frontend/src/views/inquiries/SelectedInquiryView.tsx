import React from 'react'
import { Colors } from '../../theme/Theme'
import { DynamicSpacer, HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { FlexBox } from '../components/view/FlexLayouts'
import { EInquiryStatus, IInquiry } from '../../internal/models/Inquiry'
import { ContactInquiryHeaderDisplay } from '../components/UserViewComps'
import ImageStack from '../components/images/ImageStack'
import { InsetLabeledInput } from '../components/Inputs'
import { CircleButton } from '../components/Buttons'
import DenyInquiryModal from './DenyInquiryModal'
import ConfirmationModal from '../components/modal/ConfirmationModal'
import HorizontalFilesDisplay from '../components/images/HorizontalFilesDisplay'

type TSelectedInquiryProps = {
  selectedInquiry?: IInquiry,
  handleInquiryDecision: (decision: EInquiryStatus, reason?: string) => void
}
export default function SelectedInquiryView(props: TSelectedInquiryProps) {
  const { selectedInquiry, handleInquiryDecision } = props
  if (!selectedInquiry) {
    return null
  }

  return (
    <FlexBox vertical={true} flexBias={1} style={{
      background: Colors.DARK_GREY
    }}>
      <ContactInquiryHeaderDisplay inquiry={selectedInquiry} />

      <FlexBox vertical={true} flexBias={1} margin={20}>
        <InsetLabeledInput
          label={'Budget'}
          value={`${selectedInquiry.budget}`}
        />
        <InsetLabeledInput
          label={'Timeline'}
          value={`${selectedInquiry.timeline}`}
        />
        <InsetLabeledInput
          label={'Body location'}
          value={`${selectedInquiry.body_location}`}
        />
        <InsetLabeledInput
          label={'Size'}
          value={`${selectedInquiry.size}`}
        />
        <InsetLabeledInput
          label={'Working on existing tattoo'}
          value={`${selectedInquiry.working_on_existing_tattoo}`}
        />
        <InsetLabeledInput
          label={'Description'}
          value={`${selectedInquiry.description}`}
        />

        {/*custom fields display*/}
        {selectedInquiry.fields.map((field) => {
          return (
            <InsetLabeledInput
              label={field.field}
              value={field.value ?? ""}
            />
          )
        })}

        <VerticalSpacer size={10} />
        <HorizontalFilesDisplay
          files={selectedInquiry.attachments}
          width={150}
          title={'Attachments'}
        />

        <VerticalSpacer size={20} />
        <DynamicSpacer size={1} />

        <FlexBox justify={'center'}>
          <DenyInquiryModal
            onDenied={(reason) => handleInquiryDecision(EInquiryStatus.DENIED, reason)}
          />
          <HorizontalSpacer size={30} />
          <ConfirmationModal
            action={() => handleInquiryDecision(EInquiryStatus.FLAGGED)}
            title={"Flag user?"}
            text={"This will prevent the user from contacting you any further."}
          >
            <CircleButton
              icon={'fa-flag'}
              color={Colors.RED_00}
              onClick={() => {}}
            />
          </ConfirmationModal>
          <HorizontalSpacer size={30} />
          <CircleButton
            icon={'fa-check'}
            color={Colors.GREEN}
            onClick={() => handleInquiryDecision(EInquiryStatus.ACCEPTED)}
          />
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}