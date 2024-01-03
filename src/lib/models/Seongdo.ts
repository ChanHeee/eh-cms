import { Schema } from "mongoose"
import { conn } from "$lib/db"
import type { ISeongdo } from "$lib/interfaces"
import { Simbang } from "./Simbang"
import { Family } from "./Family"
import { SeongdoEdu } from "./SeongdoEdu"

const seongdoSchema = new Schema<ISeongdo>({
  name: { type: String, required: true },
  originalName: { type: String, required: false },
  avatar: { type: String, required: false },
  birth: { type: String, required: false },
  gender: { type: String, required: false },
  phone: { type: String, required: false },
  age: { type: Number, required: false },
  jikbun: { type: String, required: false },
  singeup: { type: String, required: false },
  group1: { type: String, required: false },
  group2: { type: String, required: false },
  address: { type: String, required: false },
  remarks: { type: String, required: false },
  enrolled_at: { type: String, required: false },
})

seongdoSchema.set("timestamps", { createdAt: true, updatedAt: true })
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

seongdoSchema.pre("save", async function (next) {
  const { name } = this

  const seongdoWithOriginalName = await Seongdo.find({ originalName: name })

  this.name =
    seongdoWithOriginalName.length > 0
      ? name + (seongdoWithOriginalName.length + 1)
      : name

  next()
})

seongdoSchema.pre("deleteOne", async function (next) {
  const { _id } = this.getFilter()
  console.log(_id)

  await Simbang.deleteMany({ seongdoId: _id })
  const family = await Family.findOne({ memberIds: { $in: [_id] } })
  const newMemberIds = family?.memberIds?.filter((member) => member._id != _id)
  const newMemebers = family?.members?.filter((member) => member.seongdo != _id)
  await Family.updateOne(
    { _id: family?._id },
    { members: newMemebers, memberIds: newMemberIds }
  )
  await SeongdoEdu.deleteMany({ seongdo: _id })

  next()
})
export const Seongdo = conn.model<ISeongdo>("seongdo", seongdoSchema)
// models.seongdo ?? model<ISeongdo>("seongdo", seongdoSchema)
