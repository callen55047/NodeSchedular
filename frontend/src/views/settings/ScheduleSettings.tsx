import React, { useContext } from 'react'
import { Tile, TileHeadingAndSub, TileRowContainer } from '../components/TileLayout'
import { HorizontalSpacer, SInput, VerticalSpacer } from '../components/ViewElements'
import { SectionBody, SectionHeading } from './SettingsViewComps'
import { FlexBox } from '../components/view/FlexLayouts'
import { SettingsContext } from './SettingsContext'
import { SCheckBox } from '../components/Inputs'

export default function ScheduleSettings() {
  const { artistSettings, setArtistSettings } = useContext(SettingsContext)

  return (
    <TileRowContainer>
      <Tile>
        <TileHeadingAndSub
          title={'Schedule'}
          sub={'Set your working hours and session defaults'}
        />
        <VerticalSpacer size={30} />

        <SectionHeading name={'Daily working hours'} />
        <FlexBox justify={'flex-start'}>
          <FlexBox vertical={true}>
            <SectionBody text={'Starting at'} />
            <VerticalSpacer size={10} />
            <SectionBody text={'Ending at'} />
          </FlexBox>
          <HorizontalSpacer size={20} />
          <FlexBox vertical={true}>
            <SInput
              onChange={(value) => {
                setArtistSettings({
                  ...artistSettings, daily_work_hours: {
                    ...artistSettings.daily_work_hours, start_time: `${value}`
                  }
                })
              }}
              value={artistSettings.daily_work_hours.start_time}
              type={'time'}
            />
            <VerticalSpacer size={10} />
            <SInput
              onChange={(value) => {
                setArtistSettings({
                  ...artistSettings, daily_work_hours: {
                    ...artistSettings.daily_work_hours, end_time: `${value}`
                  }
                })
              }}
              value={artistSettings.daily_work_hours.end_time}
              type={'time'}
            />
          </FlexBox>
        </FlexBox>
        <VerticalSpacer size={30} />

        <SectionHeading name={'Create buffer time before/after bookings'} />
        <FlexBox justify={'flex-start'}>
          <SCheckBox
            text={'Enabled'}
            checked={artistSettings.session_buffer_time.enabled}
            onChange={(newValue) => {
              setArtistSettings({
                ...artistSettings, session_buffer_time: {
                  ...artistSettings.session_buffer_time, enabled: newValue
                }
              })
            }} />
        </FlexBox>
        {artistSettings.session_buffer_time.enabled &&
          <FlexBox justify={'flex-start'}>
            <FlexBox vertical={true}>
              <SectionBody text={'Before'} />
              <VerticalSpacer size={10} />
              <SectionBody text={'After'} />
            </FlexBox>
            <HorizontalSpacer size={20} />
            <FlexBox vertical={true}>
              <SInput
                onChange={(value) => {
                  setArtistSettings({
                    ...artistSettings, session_buffer_time: {
                      ...artistSettings.session_buffer_time, before: value
                    }
                  })
                }}
                value={artistSettings.session_buffer_time.before}
                type={'number'}
              />
              <VerticalSpacer size={10} />
              <SInput
                onChange={(value) => {
                  setArtistSettings({
                    ...artistSettings, session_buffer_time: {
                      ...artistSettings.session_buffer_time, after: value
                    }
                  })
                }}
                value={artistSettings.session_buffer_time.after}
                type={'number'}
              />
            </FlexBox>
          </FlexBox>
        }
        <VerticalSpacer size={30} />

        <SectionHeading name={'Default booking length'} />
        <FlexBox justify={'flex-start'}>
          <SInput
            type={'number'}
            onChange={(value) => setArtistSettings({ ...artistSettings, default_booking_length: value as number })}
            value={artistSettings.default_booking_length}
          />
        </FlexBox>
        <VerticalSpacer size={30} />

        <SectionHeading name={'Default deposit'} />
        <FlexBox justify={'flex-start'}>
          <SInput
            type={'number'}
            onChange={(value) => setArtistSettings({ ...artistSettings, default_deposit: value as number })}
            value={artistSettings.default_deposit}
          />
        </FlexBox>
        <VerticalSpacer size={30} />

        <SectionHeading name={'Default price'} />
        <FlexBox justify={'flex-start'}>
          <SInput
            type={'number'}
            onChange={(value) => setArtistSettings({ ...artistSettings, default_price: value as number })}
            value={artistSettings.default_price}
          />
        </FlexBox>
      </Tile>
    </TileRowContainer>
  )
}