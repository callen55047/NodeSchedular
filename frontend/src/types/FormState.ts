import { useState } from 'react'

type StateType = 'ready' | 'loading' | 'complete' | 'error';

interface State {
  status: StateType;
  data?: any;
  error?: string;
}

interface ITaskState {
  isReady: boolean,
  isLoading: boolean,
  isComplete: boolean,
  error?: string,
  setReady: () => void,
  setLoading: () => void,
  setComplete: (data: any) => void,
  setError: (error: string) => void
}

const FormState = (): ITaskState => {
  const [state, setState] = useState<State>({ status: 'ready' })

  return {
    isReady: state.status === 'ready',
    isLoading: state.status === 'loading',
    isComplete: state.data !== undefined,
    error: state.error,

    setReady: () => setState({ status: 'ready' }),
    setLoading: () => setState({ status: 'loading' }),
    setComplete: (data: any) => setState({ status: 'complete', data }),
    setError: (error: string) => setState({ status: 'error', error })
  }
}

export default FormState