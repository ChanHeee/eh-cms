import { json } from "@sveltejs/kit"
import { User } from "../../../../models/User"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { name, password, permissions } = await request.json()

  const user = await User.create({
    name,
    password,
    permissions,
  })

  return json({ user })
}
