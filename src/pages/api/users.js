import validate from "@/api/middlewares/validate"
import mw from "@/api/mw"
import hashPassword from "@/db/hashPassword"
import { AVERAGE_PASSWORD_HASHING_DURATION } from "@/pages/api/constants"
import sleep from "@/utils/sleep"
import {
  emailValidator,
  idValidator,
  passwordValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        userId: idValidator.required(),
      },
    }),
    async ({
      send,
      input: {
        query: { userId },
      },
      models: { UserModel },
    }) => {
      const user = await UserModel.query().findById(userId)

      if (!user) {
        send({ error: "User not found" }, 404)
      }

      send({ email: user.email })
    },
  ],
  POST: [
    validate({
      body: {
        email: emailValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    async ({
      send,
      input: {
        body: { email, password },
      },
      models: { UserModel },
    }) => {
      const user = await UserModel.query().findOne({ email })

      if (user) {
        await sleep(AVERAGE_PASSWORD_HASHING_DURATION)
        send(true)

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await UserModel.query().insert({
        email,
        passwordHash,
        passwordSalt,
      })

      send(true)
    },
  ],
  PATCH: [
    async ({
      send,
      input: {
        body: { email, password },
      },
      session,
      models: { UserModel },
    }) => {
      // Assuming you have a user ID in the session
      const { userId } = session || {}

      if (!userId) {
        send({ error: "User not authenticated" }, 401)

        return
      }

      const user = await UserModel.query().findById(userId)

      if (!user) {
        send({ error: "User not found" }, 404)

        return
      }

      // Assuming email is required and password is optional but should be valid if provided
      if (!email) {
        send({ error: "Email is required" }, 400)

        return
      }

      // Validate password if provided
      if (password) {
        const isValidPassword = passwordValidator(password)

        if (!isValidPassword) {
          send({ error: "Invalid password" }, 400)

          return
        }
      }

      const [newPasswordHash, newPasswordSalt] = await hashPassword(password)

      await UserModel.query().findById(userId).patch({
        email,
        passwordHash: newPasswordHash,
        passwordSalt: newPasswordSalt,
      })

      send(true)
    },
  ],
})

export default handle
