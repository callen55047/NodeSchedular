import React from 'react';
import {FullScreenTile} from "./components/TileLayout";
import { Icon, VerticalSpacer } from './components/ViewElements'
import { FlexBox } from './components/view/FlexLayouts'
import { BaseText } from '../theme/CustomText'
import { Colors } from '../theme/Theme'
import { SimpleButton } from './components/Buttons'
import { toast } from 'react-toastify'

export default function Support() {

  function openNewTabWith(url: string) {
    const newTab = window.open(url, '_blank')
    if (newTab) {
      newTab.focus()
    } else {
      toast.error("Opening tab blocked by browser")
    }
  }

    return (
        <FullScreenTile>
            <FlexBox
              vertical={true}
              style={{textAlign: 'center'}}
              justify={'center'}
            >
              <Icon name={'fa-users'} rSize={6} />
              <VerticalSpacer size={15} />
              <BaseText
                text={"We're here to help!"}
                size={24}
                styles={{ fontWeight: 'bold'}}
              />
              <VerticalSpacer size={20} />
              <BaseText
                text={"For general questions about how we operate, check out our support articles"}
                color={Colors.LIGHT_GREY_00}
              />
              <VerticalSpacer size={5} />
              <SimpleButton
                theme={"SECONDARY"}
                text={"Support Articles"}
                action={() => openNewTabWith('/knowledge-base')}
              />
              <VerticalSpacer size={20} />
              <BaseText
                text={"If there is a problem, reach out to us directly"}
                color={Colors.LIGHT_GREY_00}
              />
              <VerticalSpacer size={5} />
              <SimpleButton
                theme={"SECONDARY"}
                text={"Contact the Support Team"}
                action={() => openNewTabWith('/support-request')}
              />
            </FlexBox>
        </FullScreenTile>
    )
}