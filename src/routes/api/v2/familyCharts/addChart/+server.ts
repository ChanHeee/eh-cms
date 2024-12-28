import { FamilyChart } from "$lib/models/FamilyChart"
import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

//*  @desc    Create FamilyChart
//*  @route   POST /api/v2/familyCharts/addChart
//*  @access  Private/Admin
export const POST: RequestHandler = async ({ request }) => {
  const temp = await request.json()

  const chart = await FamilyChart.create({ ...temp })
  return json({ chart })
}
