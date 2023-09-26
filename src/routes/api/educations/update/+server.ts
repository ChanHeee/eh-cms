import { json } from "@sveltejs/kit"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { id, name } = await request.json()

  const education = await Education.findOneAndReplace(
    { _id: id },
    {
      name,
    }
  )

  return json({ education })
}
