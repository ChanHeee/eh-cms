import { Family } from "$lib/models/Family"
import { json, type RequestHandler } from "@sveltejs/kit"

export const PUT: RequestHandler = async ({ request, url }) => {
  const _id = decodeURI(url.pathname).split("/")[3]

  const { members, memberIds, detail } = await request.json()
  console.log(memberIds, members)

  if (memberIds.length == 0) {
    await Family.deleteOne({ _id })
    return json({ success: true })
  }

  const family = await Family.findOneAndUpdate(
    { _id },
    {
      members,
      memberIds,
      detail,
    },
    { new: true }
  ).populate("members.seongdo")

  return json({ family })
}

export const DELETE: RequestHandler = async ({ request, url }) => {
  const _id = decodeURI(url.pathname).split("/")[3]

  const { deletedCount } = await Family.deleteOne({ _id })

  if (deletedCount == 1) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
