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
  const eduName = url.searchParams.get("eduName")
  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 0
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")

  const take = url.searchParams.get("take")
    ? parseInt(url.searchParams.get("take"))
    : 12
  const skip = page ? (page - 1) * 12 : 0

  let query = Seongdo.find()
  if (name) {
    query = query.find({ name: { $regex: name } })
  }
  if (jikbun?.length > 0) {
    query = query.where({ jikbun: { $in: jikbun } })
  }

  if (eduName) {
    const { _id } = await Education.findOne({ name: eduName })
    const eduId = _id.toString()

    query = query.where({ eduIds: eduId })
  }

  switch (order) {
    case "nameAsc":
      query.sort("name")
      break
    case "nameDesc":
      query.sort("-name")
      break
    case "birthAsc":
      query.sort("birth")
      break
    case "birthDesc":
      query.sort("-birth")
      break
    default:
      query.sort("-updatedAt")
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
    skip,
  })
  const total = await Seongdo.count(query)

  return json({
    seongdos,
    total,
    take: seongdos.length <= take ? seongdos.length : take,
    skip,
  })
}

export async function POST({ request }) {
  const {
    avatar,
    name,
    birth,
    age,
    gender,
    phone,
    jikbun,
    group1,
    group2,
    singeup,
    address,
    remarks,
    seongdos,
  } = await request.json()

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
    name,
    originalName: name,
    avatar,
    gender,
    birth,
    age,
    phone,
    jikbun,
    group1,
    group2,
    singeup,
    address,
    remarks,
  })

  return json({ seongdo })
}

export async function PUT({ request }) {
  const { id: _id, ...rest } = await request.json()

  const { upsertedCount } = await Seongdo.updateOne(
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
