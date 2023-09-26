import { json } from "@sveltejs/kit"
import { Seongdo } from "../../../../models/Seongdo"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { id: _id } = await request.json()

  const result = await Seongdo.deleteOne({ _id })
  if (result.deletedCount == 1) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
