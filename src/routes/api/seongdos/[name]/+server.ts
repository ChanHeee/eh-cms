import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth } from "$lib/utils"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url, locals }) => {
  const name = decodeURI(url.pathname).split("/")[3]
  const birth = url.searchParams.get("birth")

  const seongdo = await Seongdo.findOne({ name, birth })

  return json({
    seongdo,
  })
}
