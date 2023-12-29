import { Family } from "$lib/models/Family"
import { Simbang } from "$lib/models/Simbang"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const id = url.searchParams.get("seongdoId")

  const simbangs = await Simbang.find({ seongdoId: id }).sort("-date")

  return json({ simbangs })
}

export const POST: RequestHandler = async ({ request, url }) => {
  const body = await request.json()

  const simbang = await Simbang.create({ ...body })
  return json({ simbang })
}

export const PUT = async ({ request, url }) => {
  const { id, ...rest } = await request.json()
  const { matchedCount } = await Simbang.updateOne({ _id: id }, { ...rest })

  if (matchedCount == 1) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
