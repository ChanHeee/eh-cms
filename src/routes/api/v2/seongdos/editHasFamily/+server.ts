import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const PATCH: RequestHandler = async ({ request, url }) => {
  const { id, value } = await request.json()
  console.log("editHasFamily", id, value)

  const { modifiedCount } = await Seongdo.updateOne(
    { _id: id },
    { hasFamily: value }
  )

  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
