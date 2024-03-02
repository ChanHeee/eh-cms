import { JUSO_API_KEY } from "$lib/env"
import type { IEducation } from "$lib/interfaces"
import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export const GET = async ({ request, url, fetch }) => {
  return json({ success: true })
}
