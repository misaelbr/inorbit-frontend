import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { CheckCircle2, Plus } from 'lucide-react'

import { getSummary } from '@/http/get-summary'
import { undoGoalCompletion } from '@/http/undo-goal-completion'

import { InOrbitIcon } from './in-orbit-icon'
import { PendingGoals } from './pending-goals'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'

dayjs.locale(ptBR)

export function Summary() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryFn: getSummary,
    queryKey: ['summary'],
    staleTime: 1000 * 60,
  })

  if (!data) {
    return null
  }

  async function handleUndoGoalCompletion(goalCompletionId: string) {
    await undoGoalCompletion(goalCompletionId)

    queryClient.invalidateQueries({
      queryKey: ['summary'],
    })
    queryClient.invalidateQueries({
      queryKey: ['pending-goals'],
    })
  }

  const firstDayOfWeek = dayjs().startOf('week').format('DD MMM')
  const endDayOfWeek = dayjs().endOf('week').format('DD MMM')

  const completedPercentage = Math.round((data.completed / data.total) * 100)

  return (
    <div className="mx-auto flex max-w-[480px] flex-col gap-6 px-5 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {endDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
      <div className="flex flex-col gap-3">
        <Progress value={data.completed} max={data.total}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data.completed}</span> de{' '}
            <span className="text-zinc-100">{data.total}</span> metas nessta
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>
      <Separator />
      <PendingGoals />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {data.completed < 1 ? (
          <span className="text-sm text-zinc-500">
            Ainda não há metas concluídas
          </span>
        ) : (
          Object.entries(data.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const formattedDate = dayjs(date).format('DD/MM')

            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium capitalize">
                  {weekDay}{' '}
                  <span className="text-xs text-zinc-400">
                    ({formattedDate})
                  </span>
                </h3>
                <ul className="flex flex-col gap-3">
                  {goals.map((goal) => {
                    const formattedHour = dayjs(goal.completedAt).format(
                      'HH[h]mm[min]',
                    )
                    return (
                      <li key={goal.id} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou "
                          <span className="text-zinc-100">{goal.title}</span>"
                          às{' '}
                          <span className="text-zinc-100">{formattedHour}</span>
                        </span>
                        <a
                          className="cursor-pointer text-zinc-500 underline transition-opacity duration-300 hover:text-zinc-300 hover:no-underline"
                          onClick={() => handleUndoGoalCompletion(goal.id)}
                        >
                          <span>Desfazer</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
