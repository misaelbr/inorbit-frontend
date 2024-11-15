import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Cookies from 'universal-cookie'

import { useAuthenticateFromGithub } from '@/http/generated/api'

export function SignInWithGithubCallback() {
  const navigate = useNavigate()
  const { mutateAsync: authenticateFromGithub } = useAuthenticateFromGithub()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  if (!code) {
    return <Navigate to="/" />
  }

  useEffect(() => {
    authenticateFromGithub({ data: { code } }).then((response) => {
      const token = response.token
      const cookies = new Cookies()

      cookies.set('in-orbit.token', token, {
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })

      navigate('/app')
    })
  }, [])

  return (
    <div className="center flex h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-gray-500" />
    </div>
  )
}
