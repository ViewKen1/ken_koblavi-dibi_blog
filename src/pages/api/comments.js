import auth from "@/api/middlewares/auth"
import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  descriptionValidator,
  idValidator,
  pageValidator,
} from "@/utils/validators"

const handle = mw({
  POST: [
    auth,
    validate({
      body: {
        postId: idValidator.required(),
        userId: idValidator.required(),
        description: descriptionValidator.required(),
      },
    }),
    async ({ send, input: { body }, models: { CommentModel } }) => {
      const newProduct = await CommentModel.query().insertAndFetch({
        description: body.description,
        // eslint-disable-next-line camelcase
        post_id: body.postId,
        iduser: body.userId,
      })

      send(newProduct)
    },
  ],
  GET: [
    validate({
      query: {
        postId: idValidator.required(),
        userId: idValidator.required(),
        page: pageValidator.required(),
      },
    }),
    async ({ send, input: { query }, models: { CommentModel } }) => {
      const response = await CommentModel.query().where({
        // eslint-disable-next-line camelcase
        post_id: query.postId,
        iduser: query.userId,
      })

      send(response, { count: response?.length })
    },
  ],
})

export default handle
