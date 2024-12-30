import { JWT_SECRET } from "$lib/env"
import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth } from "$lib/utils"
import { json, type RequestHandler } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

const verifyBearerToken = (token) => {
  let tokenString = token?.split("Bearer ")[1]
  console.log(tokenString, "here")

  if (!tokenString) {
    return false
  }
  jwt.verify(tokenString, JWT_SECRET, (err, decoded) => {
    if (err) {
      return false
    }
  })
  return true
}

export const GET: RequestHandler = async ({ request, url, locals }) => {
  // if (!verifyBearerToken(request.headers.get("authorization"))) {
  //   return json({ success: false, message: "token is invalid" })
  // }

  const name = decodeURI(url.pathname).split("/")[3]
  const birth = url.searchParams.get("birth")

  const seongdo = await Seongdo.findOne({ name, birth })

  return json({
    seongdo,
  })
}
