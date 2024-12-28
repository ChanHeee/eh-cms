import { JWT_SECRET } from "$lib/env"
import { json } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token")
  let tokenError = false

  if (event.url.pathname.startsWith("/api")) {
    if (!event.url.pathname.startsWith("/api/users")) {
      if (!token) {
        return json({ success: false, message: "token is required" })
      }
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          tokenError = true
        }
      })
    }
  }

  event.locals.token = token

  if (tokenError) {
    return json({ success: false, message: "token is invalid" })
  } else {
    return resolve(event)
  }
}

export const handleFetch = ({ request, fetch, event }) => {
  let token = event.cookies.get("token")

  let tokenError = false

  if (event.url.pathname.startsWith("/api")) {
    if (!event.url.pathname.startsWith("/api/users")) {
      if (!token) {
        return json({ success: false, message: "token is required" })
      }
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          tokenError = true
        }
      })
    }
  }

  if (token) {
    request.headers.set("authorization", token)
  }

  if (tokenError) {
    return json({ success: false, message: "token is invalid" })
  } else {
    return fetch(request)
  }
}
