import { Education } from "$lib/models/Education"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const name = url.searchParams.get("name")
  const seongdo = url.searchParams.get("seongdo")
  const semester = url.searchParams.get("semester")
  const startDate = url.searchParams.get("startDate")
  const status = url.searchParams.get("status")

  if (seongdo) {
    const educations = await Education.find({}).populate({
      path: "seongdos",
      match: { name: seongdo },
    })
    return json({ educations })
  }

  let query = Education.find()
  if (name) {
    query = query.find({ name })
  }

  if (semester) {
    query = query.find({ semester })
  }

  if (startDate) {
    query = query.find({ startDate })
  }

  if (status) {
    query = query.find({ status })
  }

  query.sort("-startDate")

  const educations = await Education.find(query).populate("seongdos")
  return json({ educations })
}

export const POST: RequestHandler = async ({ request }) => {
  const education = await Education.create({ ...(await request.json()) })
  return json({ education })
}

export const PUT: RequestHandler = async ({ request }) => {
  const { id, enrolledNum, seongdos, ...rest } = await request.json()

  const { upsertedCount } = await Education.updateOne(
    { _id: id },
    {
      enrolledNum: seongdos.length,
      seongdos,
      ...rest,
    }
  )
  if (upsertedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}

export const DELETE: RequestHandler = async ({ request }) => {
  const { id: _id } = await request.json()

  const result = await Education.deleteOne({ _id })
  if (result.deletedCount) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
