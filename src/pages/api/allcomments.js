import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { idValidator, pageValidator } from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        postId: idValidator.required(),
        page: pageValidator.required(),
      },
    }),
    async ({ send, input: { query }, models: { CommentModel } }) => {
      const response = await CommentModel.query().where({
        // eslint-disable-next-line camelcase
        post_id: query.postId,
      })

      send(response, { count: response?.length })
    },
  ],
})

export default handle
