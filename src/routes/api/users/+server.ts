import { User } from "$lib/models/User"
import { json } from "@sveltejs/kit"

export const POST = async ({ request }) => {
  const body = await request.json()
  console.log(body)

  const user = await User.create({ ...body })
  return json({ user })
}
