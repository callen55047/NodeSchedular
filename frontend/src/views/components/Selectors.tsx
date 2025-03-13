import React from 'react'
import { Colors } from '../../theme/Theme'

interface ISelectionListProps {
  options: string[],
  current: string,
  onSelect: (value: string) => void
}
function SelectionList(props: ISelectionListProps) {
  const { options, current, onSelect } = props

  return (
    <select
      style={{
        background: 'transparent',
        borderRadius: 4,
        border: `1px solid grey`,
        color: Colors.OFF_WHITE,
        fontSize: 14,
        fontWeight: 'bold',
        padding: 5
      }}
      onChange={(e) => onSelect(e.target.value)}
      value={current}
    >
      {options.map((option) => {
        return (
          <option value={option}>
            {option}
          </option>
        )
      })}
    </select>
  )
}

export {
  SelectionList
}