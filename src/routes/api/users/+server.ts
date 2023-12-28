import { User } from "$lib/models/User"
import { json } from "@sveltejs/kit"

export const POST = async ({ request }) => {
  const { name, password, allowedGroup } = await request.json()

  const user = await User.create({ name, password, allowedGroup })
  return json({ user })
}
