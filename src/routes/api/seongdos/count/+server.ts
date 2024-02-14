import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export async function POST({ request }) {
  const { group1, group2 } = await request.json()
  let query = Seongdo.find()

  if (group1 == "기타") {
    if (group2 == "미분류") {
      query = query.where({ $or: [{ group1: "" }, { group1: undefined }] })
    } else if (group2) {
      query = query.where({ group1, group2 })
    } else {
      query = query.where({
        $or: [
          { group1: "" },
          { group1: undefined },
          { group1, group2: { $in: ["별명부", "재적"] } },
        ],
      })
    }
  } else {
    if (group1 && group2) {
      if (group1 == "장년부") {
        query = query.where({ group1, group2: { $regex: group2 } })
      } else {
        query = query.where({
          $or: [
            { group1, group2 },
            { "services.group1": group1, "services.group2": group2 },
          ],
        })
      }
    } else if (group1) {
      if (group1 == "장년부") {
        query = query.where({ group1 })
      } else {
        query = query.where({
          $or: [{ group1 }, { "services.group1": group1 }],
        })
      }
    }
  }

  // if (group1 == "기타" && group2 == "미분류") {
  //   query = query.where({ $or: [{ group1: "" }, { group1: undefined }] })
  // } else if (group1 == "기타") {
  //   query = query.where({
  //     $or: [{ group1: "기타" }, { group1: "" }, { group1: undefined }],
  //   })
  // } else {
  //   if (group1) {
  //     // query = query.where({ $or: [{ group1 }, { "services.group1": group1 }] })
  //     query = query.where({ $or: [{ group1 }, { "services.group1": group1 }] })
  //   }
  //   if (group2) {
  //     if (group1 == "장년부") {
  //       query = query.where({ group2: { $regex: group2 } })
  //     } else {
  //       query = query.where({
  //         $or: [{ group2 }, { "services.group2": group2 }],
  //       })
  //     }
  //   }
  // }

  const count = await Seongdo.count(query)

  return json({ count })
}
