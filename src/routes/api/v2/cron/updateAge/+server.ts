import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth } from "$lib/utils"
import { json, RequestHandler } from "@sveltejs/kit"

//*  @desc    Update seongdo's age
//*  @route   GET /api/v2/cron/updateAge
//*  @access  Private/Admin
export const GET: RequestHandler = async ({ request }) => {
  const date = new Date()
  const today = `${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`

  const seongdos = await Seongdo.find(
    {
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
  console.log(modifiedCount)

  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
