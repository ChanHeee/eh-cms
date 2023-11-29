import { conn } from "$lib/db"
import type { IFamily, IMember } from "$lib/interfaces"
import { Schema } from "mongoose"

const memberSchema = new Schema<IMember>({
  seongdo: { type: Schema.Types.ObjectId, ref: "seongdo" },
  classification: { type: String },
})

const familySchema = new Schema<IFamily>({
  memberIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "seongdo",
    },
  ],
  members: [{ type: memberSchema }],
})

export const Family = conn.model<IFamily>("family", familySchema)
