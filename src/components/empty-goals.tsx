import { Plus } from 'lucide-react'
import ReactGA from 'react-ga4'

import letsStart from '@/assets/lets-start-ilustration.svg'
import logo from '@/assets/logo-in-orbit.svg'

import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'

export function EmptyGoals() {
  function handleClick() {
    ReactGA.event({
      category: 'Goal',
      action: 'Click button',
      label: 'Create Goal',
    })
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8">
      <img src={logo} alt="logo" />
      <img src={letsStart} alt="logo" />
      <p className="max-w-80 text-center leading-relaxed text-zinc-300">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora
        mesmo?
      </p>

      <DialogTrigger asChild>
        <Button onClick={() => handleClick()}>
          <Plus className="size-4" />
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </main>
  )
}
