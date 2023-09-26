import { json } from "@sveltejs/kit"
import { User } from "../../../../models/User"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { name } = await request.json()

  const user = await User.findOne({
    name,
  })

  return json({ user })
}
