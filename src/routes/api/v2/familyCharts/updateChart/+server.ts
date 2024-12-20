import { FamilyChart } from "$lib/models/FamilyChart"
import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

//*  @desc    Update FamilyChart
//*  @route   POST /api/v2/familyCharts/updateChart
//*  @access  Private/Admin

export const GET: RequestHandler = async ({ request }) => {
  return json({ success: true })
}
export const PUT: RequestHandler = async ({ request }) => {
  const { id, charts } = await request.json()

  const { modifiedCount } = await FamilyChart.updateOne(
    {
      _id: id,
    },
    {
      charts,
    }
  )
  return json({ success: true })
}
