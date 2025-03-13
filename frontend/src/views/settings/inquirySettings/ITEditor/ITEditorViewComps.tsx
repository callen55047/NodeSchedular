import React from 'react'
import { Icon } from '../../../components/ViewElements'
import { Colors } from '../../../../theme/Theme'
import { BaseText } from '../../../../theme/CustomText'
import { RChildren } from '../../../../types/GenericTypes'
import { FlexBox } from '../../../components/view/FlexLayouts'
import { BaseTable } from '../../../components/Tables'
import { TattooBudget, TattooPlacement, TattooSize, TattooTimeline } from '../../../../internal/inquiry/TattooDefaults'

interface IconToggleProps {
  value: string,
  onChange?: (value: string) => void,
  onDelete?: () => void
}

const FieldOption: React.FC<IconToggleProps> = ({ value, onDelete, onChange }) => {
  return (
    <div
      style={{
        borderRadius: 4,
        backgroundColor: Colors.LIGHT_GREY_00,
        padding: '4px 8px',
        margin: 3
      }}
    >
      {onChange !== undefined ?
        <input
          type={'text'}
          value={value}
          onChange={(e) => onChange!!(e.target.value)}
          style={{
            maxWidth: '80%',
          }}
        />
        :
        <BaseText text={value} />
      }

      {onDelete &&
        <Icon
          name={'fa-times'}
          color={Colors.RED_00}
          margin={"0 0 0 5px"}
          onClick={onDelete}
        />
      }
    </div>
  )
}

const FieldOptionsContainer: React.FC<RChildren> = ({ children }) => {
  return (
    <FlexBox
      wrap={'wrap'}
      justify={'flex-start'}
      style={{maxWidth: '400px'}}
    >
      {children}
    </FlexBox>
  )
}

const RequiredFieldsTable = () => {
  return (
    <BaseTable
      head={
        <tr>
          <th>Field</th>
          <th>Options</th>
        </tr>
      }
      body={
        <>
          <tr>
            <td>Timeline</td>
            <td className={'td-no-padding'}>
              <FieldOptionsContainer>
                <FieldOption value={TattooTimeline.asap} />
                <FieldOption value={TattooTimeline.thisMonth} />
                <FieldOption value={TattooTimeline.fewMonths} />
                <FieldOption value={TattooTimeline.thisYear} />
                <FieldOption value={TattooTimeline.undecided} />
              </FieldOptionsContainer>
            </td>
          </tr>
          <tr>
            <td>Budget</td>
            <td className={'td-no-padding'}>
              <FieldOptionsContainer>
                <FieldOption value={TattooBudget.small} />
                <FieldOption value={TattooBudget.medium} />
                <FieldOption value={TattooBudget.large} />
                <FieldOption value={TattooBudget.xLarge} />
                <FieldOption value={TattooBudget.xxLarge} />
              </FieldOptionsContainer>
            </td>
          </tr>
          <tr>
            <td>Size</td>
            <td className={'td-no-padding'}>
              <FieldOptionsContainer>
                <FieldOption value={TattooSize.small} />
                <FieldOption value={TattooSize.medium} />
                <FieldOption value={TattooSize.large} />
                <FieldOption value={TattooSize.xLarge} />
              </FieldOptionsContainer>
            </td>
          </tr>
          <tr>
            <td>Body location</td>
            <td className={'td-no-padding'}>
              <FieldOptionsContainer>
                <FieldOption value={TattooPlacement.head} />
                <FieldOption value={TattooPlacement.neck} />
                <FieldOption value={TattooPlacement.chest} />
                <FieldOption value={TattooPlacement.arm} />
                <FieldOption value={TattooPlacement.forearm} />
                <FieldOption value={TattooPlacement.hand} />
                <FieldOption value={TattooPlacement.stomach} />
                <FieldOption value={TattooPlacement.groin} />
                <FieldOption value={TattooPlacement.shoulder} />
                <FieldOption value={TattooPlacement.back} />
                <FieldOption value={TattooPlacement.leg} />
                <FieldOption value={TattooPlacement.calve} />
                <FieldOption value={TattooPlacement.foot} />
              </FieldOptionsContainer>
            </td>
          </tr>
          <tr>
            <td>Work on existing tattoo</td>
            <td className={'td-no-padding'}>
              <FieldOptionsContainer>
                <FieldOption value={'Yes'} />
                <FieldOption value={'No'} />
              </FieldOptionsContainer>
            </td>
          </tr>
          <tr>
            <td>Description</td>
            <td></td>
          </tr>
          <tr>
            <td>Images</td>
            <td>Up to 2</td>
          </tr>
        </>
      }
    />
  )
}

export {
  FieldOption,
  FieldOptionsContainer,
  RequiredFieldsTable
}