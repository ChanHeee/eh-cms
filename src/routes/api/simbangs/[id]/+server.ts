import { Family } from "$lib/models/Family"
import { Simbang } from "$lib/models/Simbang"
import { json, type RequestHandler } from "@sveltejs/kit"

export const DELETE: RequestHandler = async ({ request, url }) => {
  const _id = decodeURI(url.pathname).split("/")[3]

  const result = await Simbang.deleteOne({ _id })
  if (result.deletedCount == 1) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
