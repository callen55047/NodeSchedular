import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppContainer from './AppContainer'
import DeleteAccount from '../publicRoutes/DeleteAccount'
import SupportRequest from '../publicRoutes/SupportRequest'
import ForgotPassword from '../publicRoutes/ForgotPassword'
import ResetPassword from '../publicRoutes/ResetPassword'
import ArtistPublicProfile from '../publicRoutes/ArtistPublicProfile'
import ClientAppStoreLink from '../publicRoutes/ClientAppStoreLink'
import ExpressExperience from '../express/ExpressExperience'

export default function AppRouter() {

  const router = createBrowserRouter([
    {
      path: '/portal',
      element: <AppContainer />
    },
    {
      path: '/native',
      element: <ArtistPublicProfile />
    },
    {
      path: '/delete-account',
      element: <DeleteAccount />
    },
    {
      path: '/support-request',
      element: <SupportRequest />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/client-app-link',
      element: <ClientAppStoreLink />
    },
    {
      path: '/express',
      element: <ExpressExperience />
    }
  ])

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}