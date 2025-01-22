import { JWT_SECRET } from "$lib/env"
import { redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ cookies, url }) => {
  const token = cookies.get("token")

  if (url.pathname != "/login" && url.pathname != "/karis") {
    if (!token) {
      throw redirect(302, "/login")
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        cookies.delete("token")
        throw redirect(302, "/login")
      }
    })
  }
}
