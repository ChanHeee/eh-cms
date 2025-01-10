import { JWT_SECRET } from "$lib/env"
import { json } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

export const handle = async (value) => {
  const { event, resolve } = value
  const token = event.cookies.get("token")
  event.request.headers.set("authorization", token)
  // let tokenError = false

  // if (event.url.pathname.startsWith("/api")) {
  //   if (!event.url.pathname.startsWith("/api/users")) {
  //     if (!token) {
  //       return json({ success: false, message: "token is required" })
  //     }
  //     jwt.verify(token, JWT_SECRET, (err, decoded) => {
  //       if (err) {
  //         tokenError = true
  //       }
  //     })
  //   }
  // }

  event.locals.token = token
  return resolve(event)

  // if (tokenError) {
  //   return json({ success: false, message: "token is invalid" })
  // } else {
  //   return resolve(event)
  // }
}

export const handleFetch = (value) => {
  const { request, fetch, event } = value
  let token = event.cookies.get("token")

  // let tokenError = false

  // if (event.url.pathname.startsWith("/api")) {
  //   if (!event.url.pathname.startsWith("/api/users")) {
  //     if (!token) {
  //       return json({ success: false, message: "token is required" })
  //     }
  //     jwt.verify(token, JWT_SECRET, (err, decoded) => {
  //       if (err) {
  //         tokenError = true
  //       }
  //     })
  //   }
  // }

  if (token) {
    request.headers.set("authorization", token)
  }
  return fetch(request)

  // if (tokenError) {
  //   return json({ success: false, message: "token is invalid" })
  // } else {
  //   return fetch(request)
  // }
}
