import { json } from "@sveltejs/kit"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { name } = await request.json()

  const education = await Education.create({
    name,
  })

  return json({ education })
}
