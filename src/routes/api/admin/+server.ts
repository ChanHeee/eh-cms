import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export const POST = async ({ request, url }) => {
  const seongdos = await Seongdo.find({ name: "김유정2" })
  Promise.all(
    seongdos.map(async (seongdo) => {
      const { birth } = seongdo
      console.log(parseInt(birth.split("-")[0]))

      // if (birth) {
      //   if (parseInt(birth.split("-")[0]) > 1998) {
      //     await Seongdo.updateOne(
      //       { name: seongdo.name },
      //       { $set: { group2: "2청년" } }
      //     )
      //   } else {
      //     await Seongdo.updateOne(
      //       { name: seongdo.name },
      //       { $set: { group2: "1청년" } }
      //     )
      //   }
      // }
    })
  )

  return json({ success: true })
}
