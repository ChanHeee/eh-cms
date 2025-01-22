import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const name = url.searchParams.get("name")
  const excludeStu = url.searchParams.get("excludeStu")

  let seongdoMatch: any = {}
  if (excludeStu == "true") {
    seongdoMatch.group1 = { $ne: "교회학교" }
  }
  seongdoMatch.name = name
  const seongdo = await Seongdo.findOne(seongdoMatch)

  return json({ seongdo })
}
