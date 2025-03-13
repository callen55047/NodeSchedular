import React from 'react'

interface IProgressBarProps {
  fillPercent: number,
  height?: string,
  backgroundColor?: string,
  fillColor?: string,
}

export default function ProgressBar(props: IProgressBarProps) {
  const { fillPercent, fillColor, height, backgroundColor } = props
  const validFillPercent = Math.max(0, Math.min(1, fillPercent))

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: backgroundColor || 'black',
        borderRadius: '8px',
        overflow: 'hidden',
        height: height || 5,
        alignSelf: 'center',
      }}
    >
      <div
        style={{
          width: `${validFillPercent * 100}%`,
          backgroundColor: fillColor || 'green',
          height: '100%'
        }}
      ></div>
    </div>
  )
}
