export const up = async (db) => {
  await db.schema.createTable("posts", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("description")
    table.integer("iduser").notNullable()
    table.foreign("iduser").references("id").inTable("users")
  })

  await db.schema.createTable("comments", (table) => {
    table.increments("id")
    table.text("description").notNullable()
    table.integer("iduser").notNullable()
    table.foreign("iduser").references("id").inTable("users")
    table.integer("post_id").notNullable()
    table.foreign("post_id").references("id").inTable("posts")
  })
}

export const down = async (db) => {
  await db.schema.dropTable("comments")
  await db.schema.dropTable("posts")
}
