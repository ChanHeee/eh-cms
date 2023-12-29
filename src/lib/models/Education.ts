import { conn } from "$lib/db"
import type { IEducation } from "$lib/interfaces"
import { Schema } from "mongoose"
import { SeongdoEdu } from "./SeongdoEdu"

const eduSchema = new Schema<IEducation>({
  name: { type: String, required: true },
  teacher: { type: String },
  semester: { type: String },
  day: { type: String },
  time: { type: String },
  place: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  enrolledNum: { type: Number },
})

eduSchema.pre("deleteOne", async function (next) {
  const { _id } = this.getFilter()

  await SeongdoEdu.deleteMany({ education: _id })

  next()
})

export const Education = conn.model<IEducation>("education", eduSchema)
