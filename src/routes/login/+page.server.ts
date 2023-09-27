import { redirect, type Load } from "@sveltejs/kit"
import jwt from "jsonwebtoken"
import { env } from "$lib"

/** @type {import('@sveltejs/kit').Load} */
export const load: Load = async ({ url, locals }) => {
  let { token } = locals

  const decoded = await jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.name)
      return null
    }
    return decoded
  })
  if (decoded?.name != undefined) {
    throw redirect(302, "/")
  }
}
