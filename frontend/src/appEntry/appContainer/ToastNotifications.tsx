import React from 'react'
import { ToastContainer } from 'react-toastify'

export default function ToastNotifications() {

  return (
    <ToastContainer
      position={'top-right'}
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme={'dark'}
      toastStyle={{
        border: '1px solid grey'
      }}
    />
  )
}