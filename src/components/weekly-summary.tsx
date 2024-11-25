import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import {
  getGetPendingGoalsQueryKey,
  getGetUserLevelAndExperienceQueryKey,
  getGetWeekSummaryQueryKey,
  type GetWeekSummary200Summary,
  useUndoCompletion,
} from '@/http/generated/api'

import { InOrbitIcon } from './in-orbit-icon'
import { PendingGoals } from './pending-goals'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'
import { UserLevel } from './user-level'
import { UserProfile } from './user-profile'

dayjs.locale(ptBR)
dayjs.extend(utc)
dayjs.extend(timezone)

interface WeeklySummaryProps {
  summary: GetWeekSummary200Summary
}

export function WeeklySummary({ summary }: WeeklySummaryProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: undoGoalCompletion } = useUndoCompletion()

  const [searchParams, setSearchParams] = useSearchParams()

  const weekStartsAtParam = searchParams.get('week_starts_at')

  const weekStartsAt = weekStartsAtParam
    ? new Date(weekStartsAtParam)
    : new Date()

  async function handleUndoGoalCompletion(goalCompletionId: string) {
    await undoGoalCompletion({ goalCompletionId })

    queryClient.invalidateQueries({
      queryKey: getGetWeekSummaryQueryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: getGetPendingGoalsQueryKey(),
    })
    queryClient.invalidateQueries({
      queryKey: getGetUserLevelAndExperienceQueryKey(),
    })
  }

  const fromDate = dayjs(weekStartsAt).startOf('week').format('DD[ de ]MMM')
  const toDate = dayjs(weekStartsAt).endOf('week').format('DD[ de ]MMM')

  const completedPercentage = summary.total
    ? Math.round((summary.completed / summary.total) * 100)
    : 0

  function handlePreviusWeek() {
    const params = new URLSearchParams(searchParams)

    params.set(
      'week_starts_at',
      dayjs(weekStartsAt).subtract(1, 'week').toISOString(),
    )

    setSearchParams(params)
  }

  function handleNextWeeek() {
    const params = new URLSearchParams(searchParams)

    params.set(
      'week_starts_at',
      dayjs(weekStartsAt).add(1, 'week').toISOString(),
    )

    setSearchParams(params)
  }

  // const isCurrentWeek = dayjs(weekStartsAt).startOf('week').isBefore(new Date())

  const isCurrentWeek = dayjs(dayjs(weekStartsAt).endOf('week')).isAfter(
    new Date(),
  )

  return (
    <main className="mx-auto flex max-w-[600px] flex-col gap-6 px-5 py-10">
      <div className="shadow-shape flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3">
        <UserProfile />
        <UserLevel />
      </div>
      <div className="flex flex-col gap-6 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InOrbitIcon />
            <span className="text-lg font-semibold">
              {fromDate} - {toDate}
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePreviusWeek}
                variant="secondary"
                size="icon"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                onClick={handleNextWeeek}
                variant="secondary"
                size="icon"
                disabled={isCurrentWeek}
              >
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
          <DialogTrigger asChild>
            <Button size="sm" disabled={!isCurrentWeek}>
              <Plus className="size-4" />
              Cadastrar meta
            </Button>
          </DialogTrigger>
        </div>
        <div className="flex flex-col gap-3">
          <Progress
            className="bg-zinc-800"
            value={summary.completed}
            max={summary.total ?? 1}
          >
            <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
          </Progress>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Você completou{' '}
              <span className="text-zinc-100">{summary.completed}</span> de{' '}
              <span className="text-zinc-100">{summary.total}</span> metas nesta
              semana.
            </span>
            <span>{completedPercentage}%</span>
          </div>
        </div>
        <Separator />
        {isCurrentWeek && <PendingGoals />}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-medium">Sua semana</h2>
          {summary.completed < 1 ? (
            <span className="text-sm text-zinc-500">
              Nenhuma meta concluída.
            </span>
          ) : (
            summary.goalsPerDay &&
            Object.entries(summary.goalsPerDay).map(([date, goals]) => {
              const weekDay = dayjs(date).tz('America/Sao_Paulo').format('dddd')
              const formattedDate = dayjs(date)
                .tz('America/Sao_Paulo')
                .format('DD/MM')

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
                            Você completou{'"'}
                            <span className="text-zinc-100">{goal.title}</span>
                            {'"'}
                            às{' '}
                            <span className="text-zinc-100">
                              {formattedHour}
                            </span>
                          </span>
                          <Button
                            size="icon"
                            disabled={!isCurrentWeek}
                            variant="secondary"
                            className="ml-auto cursor-pointer text-red-500 underline transition-opacity duration-300 hover:animate-pulse hover:text-red-300"
                            onClick={() => handleUndoGoalCompletion(goal.id)}
                          >
                            <RotateCcw className="size-4" />
                          </Button>
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
    </main>
  )
}
