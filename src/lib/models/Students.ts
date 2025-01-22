import { Schema } from "mongoose"
import { conn } from "$lib/db"
import type { ISeongdo } from "$lib/interfaces"
import { Simbang } from "./Simbang"
import { Family } from "./Family"
import { SeongdoEdu } from "./SeongdoEdu"

const studentSchema = new Schema<ISeongdo>({
  name: { type: String, required: true },
  originalName: { type: String, required: false },
  avatar: { type: String, required: false },
  avatarVercelBlob: { type: String, required: false },
  birth: { type: String, required: false },
  gender: { type: String, required: false },
  phone: { type: String, required: false },
  age: { type: Number, required: false },
  jikbun: { type: String, required: false },
  singeup: { type: String, required: false },
  singeupDate: {
    study: { type: String, required: false },
    baptism: { type: String, required: false },
    infant: { type: String, required: false },
    confirm: { type: String, required: false },
  },
  group1: { type: String, required: false },
  group2: { type: String, required: false },
  addressHistory: [{ type: String, required: false, default: [] }],
  address: { type: String, required: false },
  remarks: { type: String, required: false },
  enrolled_at: { type: String, required: false },
  services: [
    {
      group1: String,
      group2: String,
      classification: String,
      order: { type: Number, default: 1 },
      startYear: { type: Number, default: null },
      endYear: { type: Number, default: null },
      inProgress: Boolean,
    },
  ],
})

studentSchema.set("timestamps", { createdAt: true, updatedAt: true })

studentSchema.pre("deleteOne", async function (next) {
  const { _id } = this.getFilter()

  const student = await Student.findOne({ _id })

  await Simbang.deleteMany({ seongdoId: _id })
  const families = await Family.find({ memberIds: { $in: [_id] } })

  await Promise.all(
    families.map(async (family) => {
      const newMemberIds = family?.memberIds?.filter(
        (member) => member._id != _id
      )
      const newMemebers = family?.members?.filter(
        (member) => member.seongdo != _id
      )

      if (newMemberIds?.length == 0) {
        await Family.deleteOne({ _id: family?._id })
      } else {
        await Family.updateOne(
          { _id: family?._id },
          { members: newMemebers, memberIds: newMemberIds }
        )
      }
    })
  )

  await SeongdoEdu.deleteMany({ seongdo: _id })
  await Simbang.deleteMany({ seongdoId: _id })

  next()
})
export const Student = conn.model<ISeongdo>("student", studentSchema)
