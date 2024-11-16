import { Navigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

import github from '@/assets/github.svg'
import logo from '@/assets/logo-in-orbit.svg'
import { Button } from '@/components/ui/button'

export function SignInWithGithub() {
  const githubUrl = new URL('login/oauth/authorize', 'https://github.com/')
  githubUrl.searchParams.set('client_id', 'Ov23li45PAZRmAvP7xIb')

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
          <img src={github} alt="" /> Entrar com github
        </a>
      </Button>
    </main>
  )
}
