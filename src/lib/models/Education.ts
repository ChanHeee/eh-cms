import { conn } from "$lib/db"
import type { IEducation } from "$lib/interfaces"
import { Schema } from "mongoose"

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

export const Education = conn.model<IEducation>("education", eduSchema)
