import { json } from "@sveltejs/kit"
import { Seongdo } from "../../../../models/Seongdo"
import { Education } from "../../../../models/Education"

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { id, avatar, name, birth, phone, jikbun, address, eduNames } =
    await request.json()

  let eduIds = await Promise.all(
    eduNames.map(async (eduName) => {
      const edu = await Education.findOne({ name: eduName })
      const eduId = edu?._id.toString()
      return eduId
    })
  )
  eduIds = eduIds.filter((value) => value != undefined)

  const seongdo = await Seongdo.findOneAndReplace(
    { _id: id },
    { name, avatar, birth, phone, jikbun, address, eduIds }
  )

  return json({ seongdo })
}
