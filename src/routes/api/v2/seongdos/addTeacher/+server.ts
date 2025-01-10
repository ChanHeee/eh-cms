import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, url }) => {
  const { seongdoId, group, classification } = await request.json()

  let groupData = {}
  if (group == "영아부") {
    groupData = { group1: "교회학교", group2: "영아부" }
  } else if (group == "유치부") {
    groupData = { group1: "교회학교", group2: "유치부" }
  } else if (group == "유년부") {
    groupData = { group1: "교회학교", group2: "유년부" }
  } else if (group == "초등부") {
    groupData = { group1: "교회학교", group2: "초등부" }
  } else if (group == "중등부") {
    groupData = { group1: "교회학교", group2: "중등부" }
  } else if (group == "고등부") {
    groupData = { group1: "교회학교", group2: "고등부" }
  } else if (group == "2청년") {
    groupData = { group1: "청년부", group2: "2청년" }
  } else if (group == "1청년") {
    groupData = { group1: "청년부", group2: "1청년" }
  }
  let order
  switch (classification) {
    case "교구장로":
      order = 10
      break
    case "교구장":
      order = 9
      break
    case "부교구장":
      order = 8
      break
    case "구역장":
      order = 7
      break
    case "부구역장":
      order = 6
      break
    case "담당교역자":
      order = 6
      break
    case "부장":
      order = 5
      break
    case "부감":
      order = 4
      break
    case "교사":
      order = 3
      break
    default:
      break
  }

  const { modifiedCount } = await Seongdo.updateOne(
    { _id: seongdoId },
    {
      $push: {
        services: Object.assign(groupData, {
          classification,
          order,
          startYear: new Date().getFullYear(),
        }),
      },
    }
  )

  if (modifiedCount > 0) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
