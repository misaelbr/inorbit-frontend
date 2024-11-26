import { useGetUserLevelAndExperience } from '@/http/generated/api'

import { Progress, ProgressIndicator } from './ui/progress-bar'

export function UserLevel() {
  const { data } = useGetUserLevelAndExperience()
  if (!data) {
    return null
  }

  const percentage = Math.round(
    (data.experience * 100) / data.experienceToNextLevel,
  )

  return (
    <div className="flex w-full max-w-[220px] flex-col gap-1">
      <div className="flex w-full items-center justify-between px-2 text-xxs text-zinc-200">
        <span>Lvl {data.level}</span>
        <span className="text-zinc-400">
          {data.experience}xp de {data.experienceToNextLevel}xp
        </span>
        <span>{percentage}%</span>
      </div>
      <Progress
        className="py-1"
        value={data.experience}
        max={data.experienceToNextLevel}
      >
        <ProgressIndicator style={{ width: `${percentage}%` }} />
      </Progress>
    </div>
  )
}
