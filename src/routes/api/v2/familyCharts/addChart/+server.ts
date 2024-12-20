import { FamilyChart } from "$lib/models/FamilyChart"
import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request }) => {
  return json({ success: true })
}

//*  @desc    Create FamilyChart
//*  @route   POST /api/v2/familyCharts/addChart
//*  @access  Private/Admin
export const POST: RequestHandler = async ({ request }) => {
  const temp = await request.json()
  console.log(temp)

  const chart = await FamilyChart.create({ ...temp })
  return json({ chart })
}
