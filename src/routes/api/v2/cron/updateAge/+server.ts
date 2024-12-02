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

  const seongdos = await Seongdo.find({ birth: { $regex: `${today}$` } })

  Promise.all(
    seongdos.map(async (seongdo) => {
      await Seongdo.updateOne(
        { _id: seongdo.id },
        { age: getAgeFromBirth(seongdo.birth) }
      )
    })
  )

  if (seongdos.length > 0) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
