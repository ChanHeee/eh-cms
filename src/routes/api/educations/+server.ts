import { JWT_SECRET } from "$lib/env"
import { Education } from "$lib/models/Education"
import { SeongdoEdu } from "$lib/models/SeongdoEdu"
import { json, type RequestHandler } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

export const GET: RequestHandler = async ({ request, url }) => {
  const token = request.headers.get("authorization")
  if (!token) {
    return json({ success: false, message: "token is required" })
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return json({ success: false, message: "token is invalid" })
    }
  })

  const name = url.searchParams.get("name")
  const semester = url.searchParams.get("semester")
  const startDate = url.searchParams.get("startDate")
  const day = url.searchParams.get("day")
  const time = url.searchParams.get("time")
  const order = url.searchParams.get("order")
  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1

  const take = 12

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

  if (day) {
    query = query.find({ day })
  }
  if (time) {
    query = query.find({ time })
  }
  switch (order) {
    case "nameAsc":
      query.sort({ name: 1, endDate: -1, _id: 1 })
      break
    case "nameDesc":
      query.sort({ name: -1, endDate: -1, _id: 1 })
      break
    case "endDateAsc":
      query.sort({ endDate: 1, _id: 1 })
      break
    case "endDateDesc":
      query.sort({ endDate: -1, _id: 1 })
      break
    default:
      query.sort({ endDate: -1, _id: 1 })
      break
  }

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
        order,
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
