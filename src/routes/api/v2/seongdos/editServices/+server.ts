import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const PATCH: RequestHandler = async ({ request, url }) => {
  const { name, birth, before, after } = await request.json()

  const { modifiedCount } = await Seongdo.bulkWrite([
    {
      updateOne: {
        filter: { name, birth },
        update: {
          $pull: {
            services: before,
          },
        },
      },
    },
    {
      updateOne: {
        filter: { name, birth },
        update: {
          $push: {
            services: after,
          },
        },
      },
    },
  ])

  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
