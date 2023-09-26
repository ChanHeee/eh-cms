import { conn } from "$db/mongo"
import { Schema, model, models } from "mongoose"

interface IEducation {
  _id: string
  name: string
}

const eduSchema = new Schema<IEducation>({
  name: { type: String, required: true },
})

export const Education = conn.model<IEducation>("education", eduSchema)
// models.education ?? model<IEducation>("education", eduSchema)
