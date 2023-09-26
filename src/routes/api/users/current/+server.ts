import { error, json } from "@sveltejs/kit"
import { User } from "../../../../models/User"
import jwt from "jsonwebtoken"
import { env } from "$lib"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  let token = request.headers.get("authorization")

  token = token.split(" ")[1]
  const decoded = jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.name)
      return null
    }
    return decoded
  })

  const { id, name } = decoded

  return json({ user: { name } })
}
