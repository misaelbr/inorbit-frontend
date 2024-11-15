import { useGetProfile } from '@/http/generated/api'

export function UserProfile() {
  const { data } = useGetProfile()

  if (!data) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <img className="size-8 rounded-md" src={data.profile.avatarUrl} alt="" />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold">{data.profile.name}</span>
        <span className="text-xxs font-semibold">
          {data.profile.email ?? 'sem email'}
        </span>
      </div>
    </div>
  )
}
