import React, { useContext, useEffect, useState } from 'react'
import { ModalBase } from '../../components/Modal'
import { FlexBox } from '../../components/view/FlexLayouts'
import { HorizontalSpacer, Icon, VerticalSpacer } from '../../components/ViewElements'
import { IAccount } from '../../../internal/models/Account'
import { AppInstance } from '../../../appEntry/appContainer/AppContext'
import { ApiContract } from '../../../contracts/ApiContract'
import { MultiLabelTextSwitch } from '../../components/Switches'
import { ArtistDetailContext } from './artistDetailsModal/ArtistDetailContext'
import ArtistDetailInfoTab from './artistDetailsModal/ArtistDetailInfoTab'
import ArtistDetailContactsTab from './artistDetailsModal/ArtistDetailsContactsTab'
import ArtistDetailActionsTab from './artistDetailsModal/ArtistDetailActionsTab'
import ArtistDetailsTransactionsTab from './artistDetailsModal/ArtistDetailsTransactionsTab'
import { ContactHeaderDisplay } from '../../components/UserViewComps'

let _asyncVerifyTask: ApiContract.Response.ArtistDetails | null = null

enum EArtistDetailTabs {
  INFO = 'Info',
  CONTACTS = 'Contacts',
  TRANSACTIONS = 'Transactions',
  ACTIONS = 'Actions'
}

interface ICreateArtistProps {
  artist: IAccount | null,
  setArtist: (artist: IAccount | null) => void,
  updateArtist: (artist: IAccount) => void
}

export default function ArtistDetailsModal(props: ICreateArtistProps) {
  const { api } = useContext(AppInstance)
  const { artist, setArtist, updateArtist } = props
  const [activeTab, setActiveTab] = useState<string>(EArtistDetailTabs.INFO)
  const [details, setDetails] = useState<ApiContract.Response.ArtistDetails | null>(null)

  useEffect(() => {
    fetchVerifyStatus()

    return () => {
      _asyncVerifyTask = null
    }
  }, [artist])

  async function fetchVerifyStatus() {
    if (artist) {
      _asyncVerifyTask = await api.admin.artistDetails(artist!._id)
      if (_asyncVerifyTask) {
        setDetails(_asyncVerifyTask)
      }
    }
  }

  function close() {
    setArtist(null)
    setDetails(null)
    setActiveTab(EArtistDetailTabs.INFO)
  }

  if (!artist) {
    return null
  }

  return (
    <ModalBase isActive={!!artist} setIsActive={close} shouldCloseOnEsc={true}>
      <FlexBox vertical>
        <FlexBox style={{
          borderBottom: '1px solid white',
          padding: 15,
          maxWidth: 700,
        }}>
          <ContactHeaderDisplay user={artist!} />
          <HorizontalSpacer size={75} />
          <Icon
            name={"fa-times"}
            color={'white'}
            margin={0}
            rSize={2.5}
            onClick={close}
          />
        </FlexBox>
        <VerticalSpacer size={10} />

        <FlexBox vertical margin={15}>
          <MultiLabelTextSwitch
            options={Object.values(EArtistDetailTabs)}
            current={activeTab}
            onSelect={setActiveTab}
          />
          <VerticalSpacer size={20} />

          {(!!details && !!artist) ?
            <ArtistDetailContext.Provider
              value={{
                artist,
                updateArtist,
                details
              }}
            >
              <TabViewSwitch name={activeTab} />
            </ArtistDetailContext.Provider>
            :
            <FlexBox margin={50}>
              <Icon name={'fa-gear fa-spin'} />
            </FlexBox>
          }
        </FlexBox>

      </FlexBox>
    </ModalBase>
  )
}

const TabViewSwitch = ({ name }: { name: string }) => {
  switch (name) {
    case EArtistDetailTabs.INFO:
      return <ArtistDetailInfoTab />
    case EArtistDetailTabs.CONTACTS:
      return <ArtistDetailContactsTab />
    case EArtistDetailTabs.TRANSACTIONS:
      return <ArtistDetailsTransactionsTab />
    case EArtistDetailTabs.ACTIONS:
      return <ArtistDetailActionsTab />
    default:
      return <div />
  }
}