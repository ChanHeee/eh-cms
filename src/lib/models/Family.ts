import { conn } from "$lib/db"
import type { IFamily, IMember, INonSeongdoMember } from "$lib/interfaces"
import { Schema } from "mongoose"

const memberSchema = new Schema<IMember>({
  seongdo: { type: Schema.Types.ObjectId, ref: "seongdo" },
  isSeongdo: { type: Boolean },
  classification: { type: String },
  name: { type: String },
  gender: { type: String },
  birth: { type: String },
  phone: { type: String },
})

const familySchema = new Schema<IFamily>({
  memberIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "seongdo",
      default: [],
    },
  ],
  members: [{ type: memberSchema, default: [] }],
  detail: { type: String },
})

export const Family = conn.model<IFamily>("family", familySchema)
