import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth } from "$lib/utils"
import { json, RequestHandler } from "@sveltejs/kit"

//*  @desc    Update seongdo's age
//*  @route   GET /api/v2/cron/updateAge
//*  @access  Private/Admin
export const POST: RequestHandler = async ({ request }) => {
  const date = new Date()
  const today = `${date.getMonth() + 1}-${
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  }`

  const seongdos = await Seongdo.find(
    {
      name: { $regex: "^temp.*" },
      birth: { $regex: `${today}$` },
    },
    "name birth"
  )

  let bulkUpdateOps: any = []

  seongdos.map((seongdo) => {
    bulkUpdateOps.push({
      updateOne: {
        filter: { _id: seongdo.id },
        update: { age: getAgeFromBirth(seongdo.birth) },
      },
    })
  })

  const { modifiedCount } = await Seongdo.bulkWrite(bulkUpdateOps)
  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
