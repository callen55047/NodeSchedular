import { INavigatorView } from '../navigator/INavigatorView'
import { useEffect } from 'react'

type TViewProps = {
  view: INavigatorView
}

const ListenForUserId = (props: TViewProps, onSuccess: (user_id: string) => void) =>
  useEffect(() => {
      if (props.view.params && props.view.params.user_id) {
        onSuccess(props.view.params.user_id)
      }
    },
    [props.view.params]
  )

const AutoSelectFromList = <T>(list: T[], current: any | undefined, onNewValue: (value: T) => void) =>
  useEffect(() => {
    if (list.length > 0 && !current) {
      onNewValue(list[0])
    }
  }, [list])

export {
  TViewProps,
  ListenForUserId,
  AutoSelectFromList
}