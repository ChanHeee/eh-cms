import { SeongdoEdu } from "$lib/models/SeongdoEdu"
import { json } from "@sveltejs/kit"

export const GET = async ({ request, url }) => {
  const _id = url.searchParams.get("educationId")

  const count = await SeongdoEdu.count({ education: _id })
  return json({ count })
}
