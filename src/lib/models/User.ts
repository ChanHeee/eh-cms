import { Model, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import { conn } from "$lib/db"
import type { IUser } from "$lib/interfaces"
conn

interface DBUserMethods {
  matchPassword(password: string): Promise<boolean>
}

type DBUserModel = Model<IUser, {}, DBUserMethods>

const userSchema = new Schema<IUser, DBUserModel, DBUserMethods>({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: [{ type: String, required: false }],
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.pre("findOneAndReplace", async function (this) {
  let update = { ...this.getUpdate() }

  const salt = await bcrypt.genSalt(10)
  let password = await bcrypt.hash(this.password, salt)

  update.password = password
  this.setUpdate(update)
})

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  const result = await bcrypt.compare(enteredPassword, this.password)
  return result
}

// export const User = models.user ?? model<IUser, DBUserModel>("user", userSchema)
export const User = conn.model<IUser, DBUserModel>("user", userSchema)
