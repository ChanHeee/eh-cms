import { BLOB_READ_WRITE_TOKEN, JUSO_API_KEY } from "$lib/env"
import type { IEducation } from "$lib/interfaces"
import { Education } from "$lib/models/Education"
import { Family } from "$lib/models/Family"
import { Seongdo } from "$lib/models/Seongdo"
import {
  dataURItoBlob,
  getCroppedImg,
  getThumbFile,
} from "$lib/utils/canvasUtils"
import { json } from "@sveltejs/kit"

export const GET = async ({ request, url, fetch }) => {
  const seongdos = await Seongdo.find({
    // group1: "장년부",
    // group2: { $regex: "2교구" },
    "services.group1": "교회학교",
    "services.startYear": null,
  }).select("-avatar")

  const bulkWriteOp: any = []

  seongdos.map((seongdo, idx) => {
    const service = seongdo.services.filter((item) => item.group1 == "교회학교")

    service.map((item, idx) => {
      const pull = {
        updateOne: {
          filter: { _id: seongdo._id },
          update: {
            $pull: {
              services: service[idx],
            },
          },
        },
      }

      const push = {
        updateOne: {
          filter: { _id: seongdo._id },
          update: {
            $push: {
              services: { ...service[idx], startYear: null, endYear: null },
            },
          },
        },
      }

      bulkWriteOp.push(pull, push)
    })
  })

  const { modifiedCount } = await Seongdo.bulkWrite(bulkWriteOp)

  console.log(modifiedCount)

  if (modifiedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}

export const POST = async ({ request, url, fetch }) => {
  const seongdos = await Seongdo.aggregate().match({
    $and: [
      { "services.group2": "유년부" },
      { avatar: { $ne: null } },
      { avatar: { $ne: "" } },
    ],
  })
  console.log(seongdos.length)

  // Promise.all(
  //   seongdos.map(async (seongdo) => {
  //     // const blob = dataURItoBlob(seongdo.avatar)
  //     // const result = await put(`${seongdo.name}.jpeg`, blob, {
  //     //   access: "public",
  //     //   token: BLOB_READ_WRITE_TOKEN,
  //     // })
  //     // if (result.url) {
  //     await Seongdo.updateOne(
  //       { name: seongdo.name },
  //       { $set: { avatarVercelBlob: seongdo.avatar } }
  //     )
  //     // }
  //   })
  // )

  return json({ success: true })
}
