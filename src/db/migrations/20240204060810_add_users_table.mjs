//Import hashPassword from "../hashPassword"

export const up = async (db) => {
  await db.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("email").notNullable()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.text("role").defaultTo("user")
    table.timestamps(true, true, true)
    table.timestamp("deletedAt")
  })
  //
  // Modifier cette partie blocage au niveau de sessions
  // const [passwordHash, passwordSalt] = await hashPassword("Admin@admin1")
  //
  // // Insérez l'administrateur dans la base de données avec le mot de passe hashé et salé
  // await db("users").insert({
  // email: "admin@admin.com",
  // passwordHash,
  // passwordSalt,
  // role: "admin",
  // })
  //
}
export const down = async (db) => {
  await db.schema.dropTable("users")
}
