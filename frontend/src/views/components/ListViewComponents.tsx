import React from 'react'
import { Colors, FontSizes } from '../../theme/Theme'
import { Icon } from './ViewElements'

type TSearchBoxProps = {
  currentValue: string,
  onChange: (text: string) => void
}
const SearchBox = ({currentValue, onChange}: TSearchBoxProps) => {
  return (
    <div style={{display: "flex"}}>
      <div style={{
        background: Colors.DARK_GREY,
        borderRadius: 4,
        display: "flex",
        flex: 1,
        color: Colors.LIGHT_GREY_00,
        border: `1px solid grey`
      }}>
        <input
          style={{
            flex: 1,
            background: Colors.DARK_GREY,
            borderWidth: 0,
            fontSize: FontSizes.f14,
            color: "white",
            margin: 5
          }}
          placeholder={"Search"}
          onChange={(e) => onChange(e.target.value)}
          value={currentValue}
        />
        <Icon
          name={currentValue ? "fa-times" : "fa-search"}
          margin={5}
          rSize={1.5}
          onClick={currentValue ? () => onChange("") : undefined}
        />
      </div>
    </div>
  )
}

type TFilterButtonProps = {
  text: string,
  isActive: boolean,
  onChange: (newState: boolean) => void
}
const FilterButton = (props: TFilterButtonProps) => {
  const { text, isActive, onChange } = props

  return <div
    style={{
      background: isActive ? Colors.LIGHT_GREY_00 : Colors.DARK_GREY,
      boxShadow: isActive ? '0 4px 4px 0 inset #00000085' : undefined,
      flex: 6,
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'center',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.5s ease-in-out'
    }}
    onClick={() => onChange(!isActive) }
  >
    <text style={{
      fontSize: 12,
      color: 'white',
      alignSelf: 'center',
      margin: 4
    }}>{text}</text>
  </div>
}

export {
  SearchBox,
  FilterButton
}