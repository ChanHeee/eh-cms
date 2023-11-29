import { Family } from "$lib/models/Family"
import { Simbang } from "$lib/models/Simbang"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const id = url.searchParams.get("seongdoId")

  const simbangs = await Simbang.find({ seongdoId: id }).sort("-updatedAt")

  return json({ simbangs })
}

export const POST: RequestHandler = async ({ request, url }) => {
  const body = await request.json()

  const simbang = await Simbang.create({ ...body })
  return json({ simbang })
}
