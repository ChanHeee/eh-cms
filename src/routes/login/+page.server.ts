import { redirect } from "@sveltejs/kit"
// import jwt from "jsonwebtoken"

import type { PageServerLoad } from "./$types"
import { ENVIRONMENT } from "$lib/env"

/** @type {import('@sveltejs/kit').Load} */
export const load: PageServerLoad = async ({ url, locals }) => {
  console.log(ENVIRONMENT)

  // const { token } = locals
  // if (token) {
  //   const decoded = await jwt.verify(token, "JWT_SECRET", (err, decoded) => {
  //     if (err) {
  //       console.log(err.name)
  //       return null
  //     }
  //     return decoded
  //   })
  //   throw redirect(302, "/")
  // }
}

export const actions = {
  login: async ({ request, cookies, fetch }) => {
    const data = await request.formData()

    const name = data.get("name")
    const password = data.get("password")

    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const { token } = await response.json()

      if (token) {
        cookies.set("token", token, {
          httpOnly: true,
          secure: ENVIRONMENT == "production" ? true : false,
          path: "/",
          maxAge: 60 * 60,
        })
        return { success: true }
      } else {
        return { success: false }
      }
    }
  },

  logout: async ({ request, cookies, fetch }) => {
    cookies.delete("token")
    throw redirect(302, "/login")
  },
}
