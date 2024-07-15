import { Family } from "$lib/models/Family"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const id = url.searchParams.get("seongdoId")

  const family = await Family.findOne()
    .where({ memberIds: { $in: [id] } })
    .populate("members.seongdo")

  return json({ family })
}

export const POST: RequestHandler = async ({ request, url }) => {
  const { members, memberIds, detail } = await request.json()

  const family = await Family.create({ memberIds, members, detail })

  const familyWithPopulate = await family.populate("members.seongdo")

  return json({ family: familyWithPopulate })
}
