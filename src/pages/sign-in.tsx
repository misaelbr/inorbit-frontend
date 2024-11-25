import ReactGA from 'react-ga4'
import { Navigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

import github from '@/assets/github.svg'
import google from '@/assets/google.svg'
import logo from '@/assets/logo-in-orbit.svg'
import { Button } from '@/components/ui/button'

export function SignIn() {
  function handleButtonClick(oauthProvider: string) {
    ReactGA.event({
      category: 'Navigation',
      label: `Login with ${oauthProvider}`,
      action: 'Click button',
    })
  }

  const githubUrl = new URL('login/oauth/authorize', 'https://github.com/')
  githubUrl.searchParams.set('client_id', import.meta.env.VITE_GITHUB_CLIENT_ID)

  const googleUrl = new URL('o/oauth2/v2/auth', 'https://accounts.google.com/')
  googleUrl.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID)
  googleUrl.searchParams.set('access_type', 'online')
  googleUrl.searchParams.set('prompt', 'consent')
  googleUrl.searchParams.set('response_type', 'code')
  googleUrl.searchParams.set(
    'scope',
    'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  )
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
        onClick={() => handleButtonClick('Github')}
        asChild
      >
        <a href={githubUrl.toString()}>
          <img src={github} alt="" /> Entrar com Github
        </a>
      </Button>
      <Button
        className="bg-white text-black hover:bg-white hover:opacity-60"
        onClick={() => handleButtonClick('Google')}
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
