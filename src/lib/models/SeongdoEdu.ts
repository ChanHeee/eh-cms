import { conn } from "$lib/db"
import type { ISeongdoEdu } from "$lib/interfaces"
import { Schema } from "mongoose"

const seongdoEduSchema = new Schema<ISeongdoEdu>({
  seongdo: {
    type: Schema.Types.ObjectId,
    ref: "seongdo",
  },
  education: {
    type: Schema.Types.ObjectId,
    ref: "education",
  },
})

export const SeongdoEdu = conn.model<ISeongdoEdu>(
  "seongdoEdu",
  seongdoEduSchema
)
