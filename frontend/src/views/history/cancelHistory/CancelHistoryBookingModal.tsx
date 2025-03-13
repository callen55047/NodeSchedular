import React, { useContext, useState } from 'react'
import { ModalBase } from '../../components/Modal'
import { FlexBox } from '../../components/view/FlexLayouts'
import { BaseButton } from '../../components/Buttons'
import { VerticalSpacer } from '../../components/ViewElements'
import { ISession } from '../../../internal/models/Session'
import { NavContext } from '../../navigator/NavContext'
import { Colors } from '../../../theme/Theme'
import { ContainerWithHeaderCloseButton } from '../../components/modal/ModalViewComps'
import { AuditRecordListItem } from '../../components/AuditRecordViewComps'

type TCancelledBookingProps = {
  session: ISession
}
export default function CancelHistoryBookingModal(props: TCancelledBookingProps) {
  const { auditManager } = useContext(NavContext)
  const { session } = props
  const [isVisible, setIsVisible] = useState(false)

  const records = auditManager.getForSession(session)

  function close() {
    setIsVisible(false)
  }

  return (
    <React.Fragment>
      <button
        style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: Colors.BLUE_00
      }}
        onClick={() => setIsVisible(true)}
      >
        view details
      </button>

      <ModalBase isActive={isVisible} setIsActive={setIsVisible} shouldCloseOnEsc={true}>
        <ContainerWithHeaderCloseButton close={close} heading={'Booking audit history'}>

          <FlexBox vertical={true}>
            {records.map((record) => {
              return (
                <AuditRecordListItem record={record} />
              )
            })}
          </FlexBox>
          <VerticalSpacer size={50} />
          <BaseButton
            action={close}
            text={'Close'}
            background={'transparent'}
          />
        </ContainerWithHeaderCloseButton>
      </ModalBase>
    </React.Fragment>
  )
}