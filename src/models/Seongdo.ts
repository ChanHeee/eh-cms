import { Schema, model, models } from "mongoose"
import type { ISeongdo } from "../lib/interface"
import { conn } from "$db/mongo"

const seongdoSchema = new Schema<ISeongdo>({
  name: { type: String, required: true },
  avatar: { type: String, required: false },
  birth: { type: String, required: false },
  phone: { type: String, required: false },
  age: { type: Number, required: false },
  jikbun: { type: String, required: false },
  address: { type: String, required: false },
  eduIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "education",
    },
  ],
})

seongdoSchema.pre("save", function (next) {
  const { birth } = this
  if (!birth) {
    next()
  }
  var birthday = new Date(birth + "T00:00:00.000Z")

  var now = new Date()
  var dd = String(now.getDate()).padStart(2, "0")
  var mm = String(now.getMonth() + 1).padStart(2, "0")
  var yyyy = now.getFullYear()
  var nowYMD = yyyy + "-" + mm + "-" + dd + "T00:00:00.000Z"
  var today = new Date(nowYMD)

  var age = today.getFullYear() - birthday.getFullYear()
  birthday.setFullYear(today.getFullYear())

  if (today < birthday) {
    age--
  }
  this.age = age
  next()
})

seongdoSchema.pre("findOneAndReplace", function (this) {
  let update = { ...this.getUpdate() }

  if (update.birth) {
    let birth = update?.birth

    var birthday = new Date(birth + "T00:00:00.000Z")

    var now = new Date()
    var dd = String(now.getDate()).padStart(2, "0")
    var mm = String(now.getMonth() + 1).padStart(2, "0")
    var yyyy = now.getFullYear()
    var nowYMD = yyyy + "-" + mm + "-" + dd + "T00:00:00.000Z"
    var today = new Date(nowYMD)

    var age = today.getFullYear() - birthday.getFullYear()
    birthday.setFullYear(today.getFullYear())

    if (today < birthday) {
      age--
    }
    update.age = age
    this.setUpdate(update)
  }
})

export const Seongdo = conn.model<ISeongdo>("seongdo", seongdoSchema)
// models.seongdo ?? model<ISeongdo>("seongdo", seongdoSchema)
