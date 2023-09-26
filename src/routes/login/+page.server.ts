import { redirect, type Load } from "@sveltejs/kit"
import { dbConnect } from "$db/mongo"
import jwt from "jsonwebtoken"
import { env } from "$lib"
import { goto } from "$app/navigation"

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
