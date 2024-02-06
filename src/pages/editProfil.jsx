import { useSession } from "@/web/components/SessionContext"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const ProfileEditPage = () => {
  const { session } = useSession()
  const { isLoading, data: user } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios.get(`/api/users`, {
        params: {
          userId: session?.user?.id,
        },
      }),
    enabled: Boolean(session?.user?.id),
    initialData: { data: {} },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>You have been disconnected</div>
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <p>Email: {user?.data?.result?.[0].email}</p>
    </div>
  )
}

export default ProfileEditPage
