import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export async function POST({ request }) {
  const { group1, group2 } = await request.json()
  let query
  if (group1 && group2) {
    query = Seongdo.find({ group1, roup2: { $regex: group2 } })
  } else if (group1 && !group2) {
    query = Seongdo.find({ group1 })
  } else if (!group1 && group2) {
    query = Seongdo.find({ group2: { $regex: group2 } })
  }

  const count = await Seongdo.countDocuments(query)
  return json({ count })
}
