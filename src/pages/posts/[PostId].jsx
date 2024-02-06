import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"
import PostCard from "@/web/components/ui/PostCard"

const ProductPage = () => {
  const { session } = useSession()
  const {
    query: { PostId },
  } = useRouter()
  const { data: postData, isLoading } = useQuery({
    queryKey: ["posts", PostId],
    queryFn: () =>
      axios.get(`/api/posts/${session?.user?.id}`, {
        params: { postId: PostId },
      }),
    enabled: Boolean(PostId) && Boolean(session?.user?.id),
    initialData: { data: {} },
  })

  if (isLoading) {
    return "Loading..."
  }

  const post = postData?.data?.result?.[0] || {}

  return (
    <PostCard
      author={post.author?.email}
      title={post.title}
      id={post.id}
      description={post.description}
    />
  )
}

export default ProductPage
