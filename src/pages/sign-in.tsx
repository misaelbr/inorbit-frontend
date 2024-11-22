import { Navigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

import github from '@/assets/github.svg'
import google from '@/assets/google.svg'
import logo from '@/assets/logo-in-orbit.svg'
import { Button } from '@/components/ui/button'

export function SignIn() {
  const githubUrl = new URL('login/oauth/authorize', 'https://github.com/')
  githubUrl.searchParams.set('client_id', import.meta.env.VITE_GITHUB_CLIENT_ID)

  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleUrl.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID)
  googleUrl.searchParams.set('access_type', 'offline')
  googleUrl.searchParams.set('prompt', 'consent')
  googleUrl.searchParams.set('response_type', 'code')
  googleUrl.searchParams.set('scope', 'email profile')
  googleUrl.searchParams.set(
    'redirect_uri',
    `${import.meta.env.VITE_FRONTEND_URL}/auth/google/callback`,
  )

  const cookies = new Cookies()
  const token = cookies.get('in-orbit.token')

  if (token) {
    return <Navigate to="/app" />
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8">
      <img src={logo} alt="logo" />
      <p className="max-w-80 text-center leading-relaxed text-zinc-300">
        Conclua suas metas semanais, ganhe experiência e suba de nível!
      </p>

      <Button
        className="bg-white text-black hover:bg-white hover:opacity-60"
        asChild
      >
        <a href={githubUrl.toString()}>
          <img src={github} alt="" /> Entrar com Github
        </a>
      </Button>
      <Button
        className="bg-white text-black hover:bg-white hover:opacity-60"
        asChild
      >
        <a href={googleUrl.toString()}>
          <img className="size-5" src={google} alt="" />
          Entrar com Google
        </a>
      </Button>
    </main>
  )
}
