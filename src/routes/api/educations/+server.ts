import { Education } from "$lib/models/Education"
import { SeongdoEdu } from "$lib/models/SeongdoEdu"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const name = url.searchParams.get("name")
  const semester = url.searchParams.get("semester")
  const startDate = url.searchParams.get("startDate")

  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1

  const take =
    url.searchParams.get("take") != null
      ? parseInt(url.searchParams.get("take"))
      : 12

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

  query.sort("-startDate")

  const educations = await Education.find(query)
    .skip((page - 1) * take)
    .limit(take)

  await Promise.all(
    educations.map(async (edu, idx) => {
      const total = await SeongdoEdu.count({ education: edu._id })
      edu.enrolledNum = total
    })
  )

  const total = await Education.count(query)

  return json({
    educations,
    page: {
      totalSize: total,
      totalPage: Math.ceil(total / take),
      requestPage: page,
      requestSize: educations.length,
      requestParams: {
        name,
        take,
      },
    },
  })
}

export const POST: RequestHandler = async ({ request }) => {
  const education = await Education.create({ ...(await request.json()) })
  return json({ education })
}

export const PUT: RequestHandler = async ({ request }) => {
  const { _id, ...rest } = await request.json()

  const { upsertedCount } = await Education.updateOne(
    { _id },
    {
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
