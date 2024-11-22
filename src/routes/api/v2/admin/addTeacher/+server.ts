import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request }) => {
  const { name, seongdoNames } = await request.json()

  let groupData = {}
  if (name == "영아부") {
    groupData = { group1: "교회학교", group2: "영아부" }
  } else if (name == "유치부") {
    groupData = { group1: "교회학교", group2: "유치부" }
  } else if (name == "유년부") {
    groupData = { group1: "교회학교", group2: "유년부" }
  } else if (name == "초등부") {
    groupData = { group1: "교회학교", group2: "초등부" }
  } else if (name == "중등부") {
    groupData = { group1: "교회학교", group2: "중등부" }
  } else if (name == "고등부") {
    groupData = { group1: "교회학교", group2: "고등부" }
  } else if (name == "2청년부") {
    groupData = { group1: "청년부", group2: "2청년부" }
  } else if (name == "1청년부") {
    groupData = { group1: "청년부", group2: "1청년부" }
  } else if (name == "은혜브릿지") {
    groupData = { group1: "교회학교", group2: "은혜브릿지" }
  } else if (name == "늘푸른부") {
    groupData = { group1: "교회학교", group2: "늘푸른부" }
  }

  const { modifiedCount } = await Seongdo.updateMany(
    { name: { $in: seongdoNames } },
    {
      $push: {
        services: Object.assign(groupData, {
          classification: "교사",
          order: 3,
        }),
      },
    }
  )
  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
