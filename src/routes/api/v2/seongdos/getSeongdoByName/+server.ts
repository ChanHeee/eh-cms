import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const name = url.searchParams.get("name")
  const excludeStu = url.searchParams.get("excludeStu")
  const excludeETC = url.searchParams.get("excludeETC")

  let seongdoMatch: any = {}
  if (excludeStu == "true") {
    seongdoMatch["$and"] = [{ $ne: "교회학교" }]
  }
  if (excludeETC == "true") {
    seongdoMatch["$and"].add({ $ne: "기타" })
  }
  seongdoMatch.name = name
  const seongdo = await Seongdo.findOne(seongdoMatch)

  return json({ seongdo })
}
