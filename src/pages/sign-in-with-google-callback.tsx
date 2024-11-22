import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cookies from 'universal-cookie'

import { useAuthenticateFromGoogle } from '@/http/generated/api'

export function SignInWithGoogleCallback() {
  const navigate = useNavigate()
  const { mutateAsync: authenticateFromGoogle } = useAuthenticateFromGoogle()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  if (!code) {
    navigate('/')
    return
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    authenticateFromGoogle({ data: { code } }).then((response) => {
      const token = response.token
      const cookies = new Cookies()

      console.log(response)

      cookies.set('in-orbit.token', token, {
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      })

      navigate('/app')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="center flex h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-gray-500" />
    </div>
  )
}
