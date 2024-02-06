import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"

class PostModel extends BaseModel {
  static tableName = "posts"

  static get relationMappings() {
    return {
      author: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "posts.iduser",
          to: "users.id",
        },
      },
    }
  }
}

export default PostModel
