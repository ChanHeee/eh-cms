import { json } from "@sveltejs/kit"
import { Seongdo } from "../../../../models/Seongdo"
import { env } from "$lib"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({}) {
  const seongdos = await Seongdo.find({}).populate("eduIds")

  return json({
    seongdos,
  })
}
