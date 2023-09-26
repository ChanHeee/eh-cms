import { error, json } from "@sveltejs/kit"
import { User } from "../../../../models/User"
import jwt from "jsonwebtoken"
import { env } from "$lib"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies, event }) {
  // cookies.delete("token")
  console.log(cookies.getAll())

  return json({})
}
