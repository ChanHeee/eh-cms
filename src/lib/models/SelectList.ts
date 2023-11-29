import { conn } from "$lib/db"
import type { ISelectList } from "$lib/interfaces"
import { Schema } from "mongoose"

const selectListSchema = new Schema<ISelectList>({
  teacherList: [{ type: String, required: false }],
  familyClassList: [{ type: String, required: false }],
})

export const SelectList = conn.model<ISelectList>(
  "selectList",
  selectListSchema
)
