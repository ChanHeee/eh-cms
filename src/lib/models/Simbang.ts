import { Schema } from "mongoose"
import { conn } from "$lib/db"
import type { ISimbang } from "$lib/interfaces"

const simbangSchema = new Schema<ISimbang>({
  seongdoId: {
    type: Schema.Types.ObjectId,
    ref: "education",
  },
  date: { type: String, required: false },
  hymn: { type: String, required: false },
  bible: { type: String, required: false },
  simbangja: { type: String, required: false },
  detail: { type: String, required: false },
})
simbangSchema.set("timestamps", { createdAt: true, updatedAt: true })

export const Simbang = conn.model<ISimbang>("simbang", simbangSchema)
