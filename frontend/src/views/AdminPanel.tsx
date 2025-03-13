import React, {useState} from 'react'
import ArtistManagementTable from './adminPanel/ArtistManagementTable'
import { FullScreenTile } from './components/TileLayout'
import { MultiLabelSwitch } from './components/Switches'
import { VerticalSpacer } from './components/ViewElements'
import { FlexBox } from './components/view/FlexLayouts'
import PlatformLogsTable from './adminPanel/PlatformLogsTable'
import UserManagementTable from './adminPanel/UserManagementTable'
import SkillTagsManagementTable from './adminPanel/SkillTagsManagementTable'
import AppTrafficTable from './adminPanel/AppTrafficTable'
import PendingRequestsTable from './adminPanel/PendingRequestsTable'

enum EAdminTabs {
  ARTISTS = 'Artists',
  USERS = 'Users',
  PENDING_REQUESTS = 'Pending Requests',
  LOGS = 'Logs',
  SKILLS = 'Skill Tags',
  TRAFFIC = 'App Traffic'
}
export default function AdminPanel() {
  const [tab, setTab] = useState<string>(EAdminTabs.ARTISTS)

  return (
    <FullScreenTile>
      <FlexBox justify={'flex-start'}>
        <MultiLabelSwitch
          options={Object.values(EAdminTabs)}
          current={tab}
          onSelect={setTab}
        />
      </FlexBox>
      <VerticalSpacer size={10} />
      <ViewSwitch name={tab} />
    </FullScreenTile>
  )
}

const ViewSwitch = ({name}: {name: string}) => {
  switch (name) {
    case EAdminTabs.ARTISTS:
      return <ArtistManagementTable />
    case EAdminTabs.USERS:
      return <UserManagementTable />
    case EAdminTabs.PENDING_REQUESTS:
      return <PendingRequestsTable />
    case EAdminTabs.LOGS:
      return <PlatformLogsTable />
    case EAdminTabs.SKILLS:
      return <SkillTagsManagementTable />
    case EAdminTabs.TRAFFIC:
      return <AppTrafficTable />
    default:
      return <div></div>
  }
}