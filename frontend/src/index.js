import React from 'react'
import ReactDOM from 'react-dom/client'
import './theme/theme.css'
import './theme/font-awesome/css/font-awesome.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import AppRouter from './appEntry/AppRouter'
import ExceptionBoundary from './appEntry/ExceptionBoundary'

const root = ReactDOM.createRoot(document.getElementById('node-schedular-app-root'))
root.render(
  <ExceptionBoundary>
    <AppRouter />
  </ExceptionBoundary>
)
