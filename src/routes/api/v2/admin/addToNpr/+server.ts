import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request }) => {
  const { seongdoNames } = await request.json()

  const { modifiedCount } = await Seongdo.updateMany(
    { name: { $in: seongdoNames } },
    {
      $push: {
        services: Object.assign({
          group1: "교회학교",
          group2: "늘푸른",
          classification: "",
          order: 2,
        }),
      },
    }
  )
  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
