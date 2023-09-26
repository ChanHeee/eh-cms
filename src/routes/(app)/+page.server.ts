import type { Load } from "@sveltejs/kit"

import { env } from "$lib"

import { Seongdo } from "../../models/Seongdo"
import { Education } from "../../models/Education"

export const load: Load = async ({}) => {
  console.log("main page.server.ts")
  const size = env.pageSize
  let seongdos = await Seongdo.find()
    .populate("eduIds", "name", Education)
    .limit(size)
    .exec()
  const total = await Seongdo.count({})
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
