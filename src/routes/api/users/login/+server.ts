import { json } from "@sveltejs/kit"
import { User } from "../../../../models/User"
import jwt from "jsonwebtoken"
import { env } from "$lib"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { name, password } = await request.json()

  const user = await User.findOne({
    name,
  })
  if (user && (await user.matchPassword(password))) {
    return json({
      token: jwt.sign({ id: user._id, name: user.name }, env.JWT_SECRET, {
        expiresIn: "30m",
      }),
    })
  } else {
    return json({ success: false, message: "fail to login" })
  }
}
