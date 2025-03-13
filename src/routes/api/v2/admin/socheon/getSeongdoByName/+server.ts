import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const name = url.searchParams.get("name")

  let seongdoMatch: any = {}
  seongdoMatch.group2 = { $ne: "소천" }
  seongdoMatch.name = { $regex: name }
  const seongdos = await Seongdo.find(seongdoMatch, undefined, { limit: 12 })

  return json({ seongdos })
}
