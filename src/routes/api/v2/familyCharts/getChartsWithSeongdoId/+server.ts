import { FamilyChart } from "$lib/models/FamilyChart"
import { json, RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

//*  @desc    Get All FamilyCharts with Id
//*  @route   GET /api/v2/familyCharts/getChartsWithId
//*  @access  Private/Admin
export const GET: RequestHandler = async ({ request, url }) => {
  const id = new ObjectId(url.searchParams.get("id") as string)
  const avatar = url.searchParams.get("avatar")

  const charts = await FamilyChart.findOne({
    $or: [
      {
        "charts.id": id,
      },
      {
        "charts.rels": id,
      },
    ],
  })
    .populate(
      "charts.id",
      `${avatar ? "name gender birth avatar " : "name gender birth"}`
    )
    .populate(
      "charts.rels.father",
      `${avatar ? "name gender birth avatar " : "name gender birth"}`
    )
    .populate(
      "charts.rels.mother",
      `${avatar ? "name gender birth avatar " : "name gender birth"}`
    )
    .populate(
      "charts.rels.spouses",
      `${avatar ? "name gender birth avatar " : "name gender birth"}`
    )
    .populate(
      "charts.rels.children",
      `${avatar ? "name gender birth avatar " : "name gender birth"}`
    )

  return json({ charts })
}
