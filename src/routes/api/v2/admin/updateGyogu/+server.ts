import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request }) => {
  const { names, group2s } = await request.json()

  let bulkUpdateOps: any = []

  names.map((name, idx) => {
    bulkUpdateOps.push({
      updateOne: {
        filter: { name },
        update: { group1: "장년부", group2: group2s[idx] },
      },
    })
  })

  const { modifiedCount } = await Seongdo.bulkWrite(bulkUpdateOps)
  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
