import type { Load } from "@sveltejs/kit"
import { Seongdo } from "../../../models/Seongdo"
import { env } from "$lib"
import { Education } from "../../../models/Education"

export const load: Load = async ({}) => {
  console.log("education page.server.ts")
  const size = env.pageSize

  const edu = await Education.findOne({ name: "기초반" })
  const eduId = edu?._id.toString()

  let seongdos = await Seongdo.find({ eduIds: eduId })
    .populate("eduIds", "name", Education)
    .limit(size)
    .exec()
  const total = await Seongdo.count({ eduIds: eduId })
  const take = seongdos.length <= size ? seongdos.length : size
  const skip = 0
  seongdos = JSON.parse(JSON.stringify(seongdos))

  return {
    seongdos,
    total,
    take,
    skip,
  }
}
