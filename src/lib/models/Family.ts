import { conn } from "$lib/db"
import type { IFamily, IMember, INonSeongdoMember } from "$lib/interfaces"
import { Schema } from "mongoose"
import { Seongdo } from "./Seongdo"

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

familySchema.post("findOneAndUpdate", async function (doc) {
  const { _id } = this.getFilter()
  const family = await Family.findOne({ _id })
  const memberIds: string[] = family?.memberIds
  console.log("familySchema", memberIds)

  await Promise.all(
    memberIds.map(async (id) => {
      const { modifiedCount } = await Seongdo.updateOne(
        { _id: id },
        { hasFamily: true }
      )
      console.log(id, modifiedCount)
    })
  )
})

export const Family = conn.model<IFamily>("family", familySchema)
