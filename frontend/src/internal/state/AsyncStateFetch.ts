import { useEffect, useState } from 'react'

let _asyncTaskHandle: any = null

interface IAsyncStateFetch<T> {
  data: T | null,
  reload: () => void
}

export default function AsyncStateFetch<T>(task: () => Promise<T | null>): IAsyncStateFetch<T> {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    fetchState()

    return () => {
      _asyncTaskHandle = null
    }
  }, [])

  async function fetchState() {
    _asyncTaskHandle = await task()
    if (_asyncTaskHandle) {
      setData(_asyncTaskHandle)
    }
  }

  return {
    data,
    reload: fetchState
  }
}