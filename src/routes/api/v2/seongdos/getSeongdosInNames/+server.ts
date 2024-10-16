import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

//*  @desc    Get Seongdos with names
//*  @route   GET /api/v2/seongdos/getSeongdosInNames
//*  @access  Private/Admin
export const POST: RequestHandler = async ({ request }) => {
  const { names } = await request.json()

  const seongdos = await Seongdo.find({ name: { $in: names } }).select(
    "-avatar"
  )
  return json({ seongdos })
}
