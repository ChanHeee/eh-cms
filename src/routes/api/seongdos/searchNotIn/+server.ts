import { json } from "@sveltejs/kit"
import { Seongdo } from "../../../../models/Seongdo"
import type { Query } from "mongoose"
import { env } from "$lib"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  let { name, jikbun, sort, skip, eduName } = await request.json()

  const take = env.pageSize
  skip = skip || 0

  let query = Seongdo.find()
  if (name) {
    query = query.find({ name: { $regex: name } })
  }
  if (jikbun?.length > 0) {
    query = query.where({ jikbun: { $in: jikbun } })
  }

  if (eduName) {
    const { _id } = await Education.findOne({ name: eduName })
    const eduId = _id.toString()

    query = query.where({ eduIds: { $nin: [eduId] } })
  }

  if (sort == "nameAsc") {
    query.sort("name")
  } else if (sort == "nameDesc") {
    query.sort("-name")
  } else if (sort == "birthAsc") {
    query.sort("birth")
  } else if (sort == "birthDesc") {
    query.sort("-birth")
  }

  const seongdos = await Seongdo.find(query, null, {
    limit: take,
    skip,
  }).populate("eduIds")
  const total = await Seongdo.count(query)

  return json({
    seongdos,
    total,
    take: seongdos.length <= take ? seongdos.length : take,
    skip,
  })
}
