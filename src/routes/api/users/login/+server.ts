import { JWT_SECRET } from "$lib/env"
import { User } from "$lib/models/User"
import { json } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { name, password } = await request.json()

  const user = await User.findOne({
    name,
  })

  if (user && (await user.matchPassword(password))) {
    return json({
      success: true,
      token: jwt.sign(
        {
          id: user._id,
          name: user.name,
          allowedGroup: ["장년부_1교구", "청년부"],
        },
        JWT_SECRET,
        {
          expiresIn: "60m",
        }
      ),
    })
  } else {
    return json({ success: false, message: "fail to login" })
  }
}
