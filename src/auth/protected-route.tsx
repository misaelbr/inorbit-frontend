import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

export function ProtectedRoute({ element }: { element: ReactElement }) {
  const cookies = new Cookies()
  const token = cookies.get('in-orbit.token')

  if (!token) {
    return <Navigate to="/" />
  }

  return element
}
