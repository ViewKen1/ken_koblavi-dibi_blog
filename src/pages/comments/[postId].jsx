/* eslint-disable max-lines-per-function */
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"
import { createResource } from "@/web/services/apiClient"
import { Formik } from "formik"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import Button from "@/web/components/ui/Button"
import { object } from "yup"
import { descriptionValidator, nameValidator } from "@/utils/validators"
import { useCallback } from "react"
import PostCard from "@/web/components/ui/PostCard"

const validationSchema = object({
  title: nameValidator.required().label("Post/comment name"),
  description: descriptionValidator.required().label("description"),
})
const initialValues = {
  title: "",
  description: "",
}
const ProductPage = () => {
  const { session } = useSession()
  const {
    query: { postId },
  } = useRouter()
  const {
    data: { data: post },
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios.get(`/api/posts/${session?.user?.id}`, {
        params: { postId },
      }),
    enabled: Boolean(postId) && Boolean(session?.user?.id),
    initialData: { data: {} },
  })
  const {
    isLoading,
    data: { data: comments },
    refetch,
  } = useQuery({
    queryKey: ["allcomments"],
    queryFn: () =>
      axios(`/api/allcomments`, {
        params: { postId },
      }),
    enabled: Boolean(postId),
    initialData: { data: {} },
  })
  const { mutateAsync: savePost } = useMutation({
    mutationFn: (posts) => createResource(`comments`, posts),
    onSuccess: () => refetch(),
  })
  const handleSubmit = useCallback(
    async ({ title, description }, { resetForm }) => {
      await savePost({
        title,
        description,
        userId: session?.user.id,
        postId,
      })
      resetForm()
    },
    [postId, savePost, session?.user.id],
  )

  if (isLoading) {
    return "Loading..."
  }

  const postPayload = post?.result?.[0] || {}

  return (
    <div>
      <PostCard
        author={postPayload.author?.email}
        title={postPayload.title}
        id={postPayload.id}
        description={postPayload.description}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormField name="title" label="Title" placeholder="Comment title" />
          <FormField
            name="description"
            label="Comment"
            placeholder="Enter your comment here..."
          />
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
      {comments?.result?.map((comment, index) => (
        <div key={comment.id}>
          <h1 className="text-2xl">#{index + 1}</h1>
          <p>{comment.description}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductPage
