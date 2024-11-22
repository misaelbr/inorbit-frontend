import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from './auth/protected-route'
import { Application } from './pages/application'
import { SignIn } from './pages/sign-in'
import { SignInWithGithubCallback } from './pages/sign-in-with-github-callback'
import { SignInWithGoogleCallback } from './pages/sign-in-with-google-callback'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SignIn />,
    },
    {
      path: '/app',
      element: <ProtectedRoute element={<Application />} />,
    },
    {
      path: '/auth/github/callback',
      element: <SignInWithGithubCallback />,
    },
    {
      path: '/auth/google/callback',
      element: <SignInWithGoogleCallback />,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
    },
  },
)
