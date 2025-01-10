import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const PATCH: RequestHandler = async ({ request, url }) => {
  const { seongdoId, group } = await request.json()

  const { modifiedCount } = await Seongdo.updateOne(
    { _id: seongdoId },
    {
      $pull: {
        services: { group2: group },
      },
    }
  )

  if (modifiedCount > 0) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
