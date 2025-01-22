import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const PATCH: RequestHandler = async ({ request, url }) => {
  const { seongdoId, address } = await request.json()

  const { modifiedCount } = await Seongdo.updateOne(
    { _id: seongdoId },
    {
      $pull: {
        addressHistory: address,
      },
    }
  )

  if (modifiedCount > 0) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
