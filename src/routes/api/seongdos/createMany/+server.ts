import { json } from "@sveltejs/kit"
import { Seongdo } from "../../../../models/Seongdo"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const body = await request.json()
  console.log(body)

  const result = await Seongdo.create(body)

  return json({ seongdos: result })
}
