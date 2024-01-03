import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth } from "$lib/utils"
import { json, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url, locals }) => {
  const name = url.searchParams.get("name")
  const jikbun =
    url.searchParams.get("jikbun") != null
      ? JSON.parse(url.searchParams.get("jikbun"))
      : []
  const order = url.searchParams.get("order")
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")
  const birthStart = url.searchParams.get("birthStart")
  const birthEnd = url.searchParams.get("birthEnd")
  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1

  const take = 12

  let query = Seongdo.find()
  if (name) {
    query = query.find({ name: { $regex: name } })
  }
  if (jikbun?.length > 0) {
    query = query.where({ jikbun: { $in: jikbun } })
  }
  if (birthStart) {
    query = query.where({ birth: { $gte: birthStart } })
  }
  if (birthEnd) {
    query = query.where({ birth: { $lte: birthEnd } })
  }

  switch (order) {
    case "nameAsc":
      query.sort({ name: 1, updatedAt: -1, _id: 1 })
      break
    case "nameDesc":
      query.sort({ name: -1, updatedAt: -1, _id: 1 })
      break
    case "birthAsc":
      query.sort({ birth: 1, updatedAt: -1, _id: 1 })
      break
    case "birthDesc":
      query.sort({ birth: -1, updatedAt: -1, _id: 1 })
      break
    default:
      query.sort({ updatedAt: -1, _id: 1 })
      break
  }

  if (group1) {
    query = query.where({ group1 })
    if (group2) {
      query = query.where({ group2: { $regex: group2 } })
    }
  }

  const seongdos = await Seongdo.find(query, null, {
    limit: take,
    skip: (page - 1) * take,
  })

  const total = await Seongdo.count(query)

  return json({
    seongdos,
    page: {
      totalSize: total,
      totalPage: Math.ceil(total / take),
      requestPage: page,
      requestSize: seongdos.length,
      requestParams: {
        name,
        jikbun,
        order,
        group1,
        group2,
        birthStart,
        birthEnd,
        take,
      },
    },
  })
}

export async function POST({ request }) {
  const { seongdos, ...rest } = await request.json()

  if (seongdos) {
    seongdos.map((seongdo) => {
      seongdo.originalName = seongdo.name
      if (seongdo.birth) {
        seongdo.age = getAgeFromBirth(seongdo.birth)
      }
    })

    const result = await Seongdo.create(seongdos)
    return json({ seongdos: result })
  }

  // const seongdoWithOriginalName = await Seongdo.find({ originalName: name })

  const seongdo = await Seongdo.create({
    ...rest,
  })

  return json({ seongdo })
}

export async function PUT({ request }) {
  const { _id, ...rest } = await request.json()

  const { upsertedCount, modifiedCount } = await Seongdo.updateOne(
    { _id },
    {
      ...rest,
    }
  )

  if (upsertedCount == 1) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}

export async function DELETE({ request }) {
  const { id: _id } = await request.json()

  const result = await Seongdo.deleteOne({ _id })
  if (result.deletedCount == 1) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
