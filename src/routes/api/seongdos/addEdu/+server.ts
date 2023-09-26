import { json } from "@sveltejs/kit"
import { Seongdo } from "../../../../models/Seongdo"
import { eduName } from "../../../../lib/store"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { ids, eduName } = await request.json()

  const { _id } = await Education.findOne({ name: eduName })
  const eduId = _id.toString()

  let seongdos = await Seongdo.where({ _id: { $in: ids } })

  seongdos.map(async (seongo) => {
    await Seongdo.updateOne(
      { _id: seongo._id },
      { eduIds: [...seongo.eduIds, eduId] }
    )
  })

  return json({ success: true })
}
