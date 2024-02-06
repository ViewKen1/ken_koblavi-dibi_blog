import { descriptionValidator, nameValidator } from "@/utils/validators"
import Button from "@/web/components/ui/Button"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import { createResource } from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { object } from "yup"
import { useSession } from "@/web/components/SessionContext"

const validationSchema = object({
  title: nameValidator.required().label("Post Title"),
  description: descriptionValidator.required().label("Description"),
})
const initialValues = {
  title: "",
  description: "",
}
const CreatePage = () => {
  const { session } = useSession()
  const router = useRouter()
  const { mutateAsync: saveProduct } = useMutation({
    mutationFn: (posts) => createResource(`posts/${session?.user?.id}`, posts),
  })
  const handleSubmit = useCallback(
    async ({ title, description }) => {
      const { data: post } = await saveProduct({
        title,
        description,
        iduser: session?.user?.id,
      })
      const postId = post.result[0].id

      if (postId) {
        router.push(`/posts/${postId}`)
      }
    },
    [saveProduct, router, session?.user?.id],
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormField
          name="title"
          label="Post title"
          placeholder="Enter a title"
        />
        <FormField
          name="description"
          label="description"
          placeholder="Enter description"
        />
        <Button type="submit">Submit</Button>
      </Form>
    </Formik>
  )
}

export default CreatePage
