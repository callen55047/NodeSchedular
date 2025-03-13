import { FlexBox } from '../../components/view/FlexLayouts'
import { BaseText } from '../../../theme/CustomText'
import { HorizontalSpacer, VerticalContentDivider, VerticalSpacer } from '../../components/ViewElements'
import React, { useContext, useEffect, useState } from 'react'
import { ModalBase } from '../../components/Modal'
import {
  createDefaultITField,
  EInquiryFieldType, IInquiryField,
  IInquiryTemplate
} from '../../../internal/models/templates/InquiryTemplate'
import SquareCard from '../../components/cards/SquareCard'
import { SettingsContext } from '../SettingsContext'
import { BaseTable } from '../../components/Tables'
import { LabeledInput, LabeledTextAreaInput, SCheckBox } from '../../components/Inputs'
import { SimpleButton } from '../../components/Buttons'
import { getDiff } from '../../../internal/ObjectHelpers'
import { Colors } from '../../../theme/Theme'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { toast } from 'react-toastify'
import { FieldOption, RequiredFieldsTable } from './ITEditor/ITEditorViewComps'

interface IInquiryTemplateModalProps {
  template: IInquiryTemplate,
  reload: () => void
}

export default function InquiryTemplateEditor(props: IInquiryTemplateModalProps) {
  const { api, runBlocking, logger } = useContext(AppInstance)
  const { artistSettings, setArtistSettings, save } = useContext(SettingsContext)
  const { template, reload } = props
  const [isActive, setIsActive] = useState(false)
  const [localTemplate, setLocalTemplate] = useState<IInquiryTemplate>({ ...template })

  useEffect(() => {
    setLocalTemplate({ ...template })
  }, [template])

  const changes = getDiff(template, localTemplate)
  const hasChanges = Object.keys(changes).length > 0
  const templateActive = artistSettings.custom_inquiry_id === template._id

  function createNewField() {
    const newFields = [...localTemplate.fields]
    newFields.push(createDefaultITField())
    setLocalTemplate({ ...localTemplate, fields: newFields })
  }

  function updateField(index: number, newField: IInquiryField) {
    const updatedFields = [...localTemplate.fields]
    updatedFields.splice(index, 1)
    updatedFields.splice(index, 0, newField)
    setLocalTemplate({ ...localTemplate, fields: [...updatedFields] })
  }

  function removeField(index: number) {
    const updatedFields = [...localTemplate.fields]
    updatedFields.splice(index, 1)
    setLocalTemplate({ ...localTemplate, fields: [...updatedFields] })
  }

  function saveTemplateSettings() {
    runBlocking(async () => {
      const res = await api.inquiryTemplate.update(localTemplate)
      if (res?.success) {
        toast.success('Inquiry Template saved!')
        reload()
      } else {
        toast.error('Failed to save inquiry template. please try again later')
        logger.error('[InquiryTemplateEditor] Unable to save template.')
      }
    })
  }

  function onClose() {
    save()
    setLocalTemplate({ ...template })
    setIsActive(false)
  }

  return (
    <>
      <SquareCard
        title={localTemplate.title}
        isActive={template?._id === artistSettings.custom_inquiry_id}
        onClick={() => setIsActive(true)}
      />

      <ModalBase isActive={isActive} setIsActive={setIsActive} shouldCloseOnEsc={false}>
        <FlexBox vertical style={{ maxWidth: 700, maxHeight: `calc(90vh)` }}>
          <FlexBox
            style={{
              background: Colors.DARK_00,
              borderRadius: 10,
              margin: 10,
              padding: 25
            }}
            justify={'space-between'}
          >
            <BaseText
              text={localTemplate.title}
              size={22}
              alignment={'center'}
              styles={{ fontWeight: 'bold' }}
            />
            <HorizontalSpacer size={50} />
            <FlexBox vertical>
              <SCheckBox
                text={'Active'}
                checked={templateActive}
                onChange={(active) => {
                  setArtistSettings({
                    ...artistSettings,
                    custom_inquiry_id: active ? template._id : null
                  })
                }}
              />
            </FlexBox>
          </FlexBox>

          <FlexBox vertical margin={25}>
            <LabeledInput
              label={'Title'}
              value={localTemplate.title}
              onChange={(v) => setLocalTemplate({ ...localTemplate, title: v })}
            />
            <LabeledTextAreaInput
              label={'Description'}
              value={localTemplate.description}
              onChange={(v) => setLocalTemplate({ ...localTemplate, description: v })}
            />
            <VerticalSpacer size={15} />

            <BaseText text={'Required Fields'} />
            <VerticalSpacer size={5} />

            <RequiredFieldsTable />
            <VerticalSpacer size={15} />

            <BaseText text={'Custom Fields'} />
            <VerticalSpacer size={5} />
            <FlexBox vertical>
              <BaseTable
                head={
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Options</th>
                    <th></th>
                  </tr>
                }
                body={
                  <>
                    {
                      localTemplate.fields.map((field, index) => {

                        return (
                          <tr>
                            {/* string name of field */}
                            <td>
                              <textarea
                                value={field.field}
                                onChange={(e) => {
                                  const newField = { ...field, field: e.target.value as string }
                                  updateField(index, newField)
                                }}
                                rows={4}
                              />
                            </td>

                            {/* type of field */}
                            <td>
                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const newField = { ...field, type: e.target.value as EInquiryFieldType }
                                  updateField(index, newField)
                                }}
                              >
                                {Object.values(EInquiryFieldType).map(t => {
                                  return (
                                    <option>{t.toString()}</option>
                                  )
                                })}
                              </select>
                            </td>

                            {/* options of field */}
                            <td>
                              {field.type === EInquiryFieldType.SELECTION &&
                                <>
                                  {field.options.map((option, subIndex) => {
                                    return (
                                      <FlexBox>
                                        <FieldOption
                                          value={option}
                                          onChange={(value) => {
                                            const newOptions = [...field.options]
                                            newOptions.splice(subIndex, 1, value)
                                            const newField = { ...field, options: newOptions }
                                            updateField(index, newField)
                                          }}
                                          onDelete={() => {
                                            const newOptions = [...field.options]
                                            newOptions.splice(subIndex, 1)
                                            const newField = { ...field, options: newOptions }
                                            updateField(index, newField)
                                          }}
                                        />
                                        <HorizontalSpacer size={5} />
                                      </FlexBox>
                                    )
                                  })}

                                  <SimpleButton
                                    theme={'PRIMARY'}
                                    text={'Add'}
                                    action={() => {
                                      const newOptions = [...field.options, `option ${field.options.length + 1}`]
                                      const newField = { ...field, options: newOptions }
                                      updateField(index, newField)
                                    }}
                                    slim
                                  />
                                </>
                              }

                              {field.type === EInquiryFieldType.CHECKBOX &&
                                <>
                                  <FieldOption value={"Yes"} />
                                  <FieldOption value={"No"} />
                                </>
                              }
                            </td>

                            {/* remove field button */}
                            <td>
                              <SimpleButton
                                theme={'DANGER'}
                                text={'Del'}
                                action={() => removeField(index)}
                                slim
                              />
                            </td>
                          </tr>
                        )
                      })
                    }
                    <tr>
                      <td colSpan={5}>
                        <SimpleButton
                          theme={'PRIMARY'}
                          text={'New Field'}
                          action={createNewField}
                          slim
                        />
                      </td>
                    </tr>
                  </>
                }
              />
            </FlexBox>

            <VerticalContentDivider fullWidth />

            <FlexBox justify={'flex-end'}>
              <SimpleButton
                theme={'SECONDARY'}
                text={hasChanges ? 'Cancel' : 'Close'}
                action={onClose}
              />
              {hasChanges &&
                <>
                  <HorizontalSpacer size={15} />
                  <SimpleButton
                    theme={'SUCCESS'}
                    text={'Save'}
                    action={saveTemplateSettings}
                  />
                </>
              }
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </ModalBase>
    </>
  )
}