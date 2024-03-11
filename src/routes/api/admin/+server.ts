import { BLOB_READ_WRITE_TOKEN, JUSO_API_KEY } from "$lib/env"
import type { IEducation } from "$lib/interfaces"
import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { dataURItoBlob } from "$lib/utils/canvasUtils"
import { json } from "@sveltejs/kit"
import { put } from "@vercel/blob"

export const POST = async ({ request, url, fetch }) => {
  const seongdos = await Seongdo.aggregate().match({
    $and: [
      { group1: "청년부" },
      { avatar: { $ne: null } },
      { avatar: { $ne: "" } },
      { name: { $ne: "박찬희" } },
    ],
  })
  console.log(seongdos.length)

  // Promise.all(
  //   seongdos.map(async (seongdo) => {
  //     const blob = dataURItoBlob(seongdo.avatar)
  //     const result = await put(`${seongdo.name}.jpeg`, blob, {
  //       access: "public",
  //       token: BLOB_READ_WRITE_TOKEN,
  //     })
  //     if (result.url) {
  //       await Seongdo.updateOne(
  //         { name: seongdo.name },
  //         { $set: { avatar: result.url } }
  //       )
  //     }
  //   })
  // )

  return json({ success: true })
}
