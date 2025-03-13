import { useState } from 'react'

export default function ItemListState<T>(items: T[]) {
  const [activeIndex, setActiveIndex] = useState(0)

  function changeIndex(isNext: boolean) {
    const nextIndex = isNext ? activeIndex + 1 : activeIndex - 1
    const clampedValue = Math.min(Math.max(nextIndex, 0), items.length - 1)
    setActiveIndex(clampedValue)
  }

  const currentItem = items.length > 0 ? items[activeIndex] : null

  return {
    currentItem,
    currentIndex: activeIndex,
    changeIndex
  }
}