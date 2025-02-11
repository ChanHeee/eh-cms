import { redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"
import type { PageServerLoad } from "./$types"
import { ENVIRONMENT, JWT_SECRET } from "$lib/env"

/** @type {import('@sveltejs/kit').Load} */
export const load: PageServerLoad = async ({ url, locals }) => {}

export const actions = {
  login: async ({ request, cookies, fetch, locals }) => {
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
    cookies.delete("token", { path: "/" })
    throw redirect(302, "/login")
  },
}
