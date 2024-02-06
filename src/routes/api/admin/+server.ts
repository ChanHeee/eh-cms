import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export const POST = async ({ request, url }) => {
  return json({ success: true })
}
