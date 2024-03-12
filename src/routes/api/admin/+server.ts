import { BLOB_READ_WRITE_TOKEN, JUSO_API_KEY } from "$lib/env"
import type { IEducation } from "$lib/interfaces"
import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import {
  dataURItoBlob,
  getCroppedImg,
  getThumbFile,
} from "$lib/utils/canvasUtils"
import { json } from "@sveltejs/kit"
import { put } from "@vercel/blob"

export const POST = async ({ request, url, fetch }) => {
  const seongdos = await Seongdo.aggregate().match({
    $and: [
      { name: "박찬희" },
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
