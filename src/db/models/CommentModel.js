import BaseModel from "@/db/models/BaseModel"
import UserModel from "@/db/models/UserModel"
import PostModel from "@/db/models/PostModel"

class CommentModel extends BaseModel {
  static tableName = "comments"

  static get relationMappings() {
    return {
      author: {
        modelClass: UserModel,
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "comments.iduser",
          to: "users.id",
        },
      },
      post: {
        modelClass: PostModel,
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "comments.post_id",
          to: "posts.id",
        },
      },
    }
  }
}

export default CommentModel
