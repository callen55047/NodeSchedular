import React, { useContext } from 'react'
import { Tile, TileHeadingAndSub, TileRowContainer } from '../components/TileLayout'
import { HorizontalSpacer, VerticalSpacer } from '../components/ViewElements'
import { SectionHeading } from './SettingsViewComps'
import { FlexBox } from '../components/view/FlexLayouts'
import InquiryTemplateEditor from './inquirySettings/InquiryTemplateEditor'
import SquareCard from '../components/cards/SquareCard'
import AsyncStateFetch from '../../internal/state/AsyncStateFetch'
import { AppInstance } from '../../appEntry/appContainer/AppContext'
import { createDefaultIT, IInquiryTemplate } from '../../internal/models/templates/InquiryTemplate'
import { toast } from 'react-toastify'
import { Colors } from '../../theme/Theme'

export default function InquirySettings() {
  const { api, runBlocking, logger } = useContext(AppInstance)
  const templateTask = AsyncStateFetch(() => api.inquiryTemplate.all())

  const templates = templateTask.data
  const canCreateNew = templates !== null && templates.length < 5

  function createNewTemplate() {
    runBlocking(async () => {
      const blankTemplate = createDefaultIT(templates!.length + 1)
      const res = await api.inquiryTemplate.create(blankTemplate as IInquiryTemplate)
      if (res?.success) {
        templateTask.reload()
        toast.success('Created new Inquiry Template')
      } else {
        toast.error('Unable to create Template. Please try again later')
        logger.error('[InquirySettings] Unable to create new inquiry template. server res is NULL')
      }
    })
  }

  return (
    <TileRowContainer>
      <Tile>
        <TileHeadingAndSub
          title={'Inquiries'}
          sub={'Create a custom inquiry form for clients'}
        />
        <VerticalSpacer size={30} />

        <SectionHeading name={'Custom Inquiries'} />

        <FlexBox justify={'flex-start'} wrap={'wrap'}>
          {templates?.map((template) => {

            return (
              <>
                <InquiryTemplateEditor
                  key={`key-${template._id}`}
                  template={template}
                  reload={() => templateTask.reload()}
                />

                <HorizontalSpacer size={15} />
              </>
            )
          })}

          {canCreateNew &&
            <SquareCard
              title={'Create new'}
              icon={'fa-plus'}
              background={null}
              color={Colors.LIGHT_GREY_00}
              onClick={createNewTemplate}
            />
          }
        </FlexBox>
      </Tile>
    </TileRowContainer>
  )
}