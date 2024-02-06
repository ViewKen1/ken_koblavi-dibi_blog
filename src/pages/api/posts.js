import auth from "@/api/middlewares/auth"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  descriptionValidator,
  idValidator,
  nameValidator,
  pageValidator,
} from "@/utils/validators"

const handle = mw({
  POST: [
    auth,
    validate({
      body: {
        title: nameValidator.required(),
        description: descriptionValidator.required(),
        userId: idValidator.required(),
      },
    }),
    async ({ send, input: { body }, models: { PostModel } }) => {
      const newProduct = await PostModel.query().insertAndFetch(body)

      send(newProduct)
    },
  ],
  GET: [
    validate({
      query: {
        page: pageValidator.required(),
      },
    }),
    async ({
      send,
      input: {
        query: { page },
      },
      models: { PostModel },
    }) => {
      const query = PostModel.query()
      const posts = await query.clone().withGraphFetched("author").page(page)
      const [{ count }] = await query.clone().count()

      send(posts, { count })
    },
  ],
})

export default handle
