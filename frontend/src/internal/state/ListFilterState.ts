import { useState } from 'react'

interface IListFilterButtons {
  [id: string]: boolean | string
}

interface IListFilterState {
  search: string,
  filters: IListFilterButtons
}

export const ListFilterState = (): [
  IListFilterState,
  (search: string) => void,
  (field: string, newState: boolean) => void
] => {
  const [state, setState] = useState<IListFilterState>({ search: '', filters: {} })

  const updateSearch = (search: string) => {
    setState({ ...state, search })
  }

  const updateFilter = (field: string, newState: boolean) => {
    const { filters } = state
    setState({
      ...state,
      filters: {
        ...filters,
        [field]: newState
      }
    })
  }

  return [state, updateSearch, updateFilter]
}