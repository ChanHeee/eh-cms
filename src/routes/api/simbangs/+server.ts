import { Family } from "$lib/models/Family"
import { Simbang } from "$lib/models/Simbang"
import { json, type RequestHandler } from "@sveltejs/kit"
import { Types } from "mongoose"

export const GET: RequestHandler = async ({ request, url }) => {
  const name = url.searchParams.get("name")
  const jikbun =
    url.searchParams.get("jikbun") != null
      ? JSON.parse(url.searchParams.get("jikbun"))
      : []
  const simbangja =
    url.searchParams.get("simbangja") != null
      ? JSON.parse(url.searchParams.get("simbangja"))
      : []
  const order = url.searchParams.get("order")
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")
  const dateStart = url.searchParams.get("dateStart")
  const dateEnd = url.searchParams.get("dateEnd")
  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1
  const take = 12
  const seongdoId = url.searchParams.get("seongdoId")
  const memberIds =
    url.searchParams.get("memberIds") != null
      ? JSON.parse(url.searchParams.get("memberIds"))
      : []
  const ids =
    url.searchParams.get("ids") != null
      ? JSON.parse(url.searchParams.get("ids"))
      : []

  if (ids.length > 0) {
    const simbangs = await Simbang.find({ _id: { $in: ids } })
      .sort({
        date: -1,
        _id: 1,
      })
      .populate("seongdoId")
    return json(simbangs)
  }

  let simbangMatch: any = {}
  if (seongdoId) {
    const ObjectId = Types.ObjectId
    if (memberIds.length > 0) {
      simbangMatch.seongdoId = {
        $in: memberIds.map((item) => new ObjectId(item)),
      }
    } else {
      simbangMatch.seongdoId = new ObjectId(seongdoId)
    }
  }
  if (simbangja?.length > 0) {
    simbangMatch.simbangja = { $in: simbangja }
  }
  if (dateStart) {
    if (dateEnd) {
      simbangMatch.date = { $gte: dateStart, $lte: dateEnd }
    } else {
      simbangMatch.date = { $gte: dateStart }
    }
  } else if (dateEnd) {
    simbangMatch.date = { $lte: dateEnd }
  }

  let seongdoMatch: any = {}
  if (name) {
    seongdoMatch.name = { $regex: name }
  }
  if (jikbun?.length > 0) {
    seongdoMatch.jikbun = { $in: jikbun }
  }
  if (group1) {
    seongdoMatch.group1 = group1
  }
  if (group2) {
    seongdoMatch.group2 = { $regex: group2 }
  }

  let aggregateSort: any = {}
  switch (order) {
    case "nameAsc":
      aggregateSort = { "seongdoId.name": 1, _id: 1 }
      break
    case "nameDesc":
      aggregateSort = { "seongdoId.name": -1, _id: 1 }
      break
    case "simbangjaAsc":
      aggregateSort = { simbangja: 1, _id: 1 }
      break
    case "simbangjaDesc":
      aggregateSort = { simbangja: -1, _id: 1 }
      break
    case "dateAsc":
      aggregateSort = { date: 1, _id: 1 }
      break
    case "dateDesc":
      aggregateSort = { date: -1, _id: 1 }
      break
    case "groupAsc":
      aggregateSort = { "seongdoId.group1": 1, "seongdoId.group2": 1, _id: 1 }
      break
    case "groupDesc":
      aggregateSort = { "seongdoId.group1": -1, "seongdoId.group2": -1, _id: 1 }
      break
    default:
      aggregateSort = { date: -1 }
      break
  }

  let simbangs = await Simbang.aggregate()
    .match(simbangMatch)
    .lookup({
      from: "seongdos",
      localField: "seongdoId",
      foreignField: "_id",
      as: "seongdoId",
      pipeline: [{ $match: seongdoMatch }],
    })
    .unwind("seongdoId")
    .project({
      _id: 1,
      "seongdoId.name": 1,
      "seongdoId.birth": 1,
      "seongdoId.avatarVercelBlob": 1,
      "seongdoId.jikbun": 1,
      "seongdoId.group1": 1,
      "seongdoId.group2": 1,
      date: 1,
      simbangja: 1,
      companion: 1,
      bible: 1,
      hymn: 1,
      detail: 1,
    })

    .sort(aggregateSort)
    .skip((page - 1) * take)
    .limit(take)

  const totalArray = await Simbang.aggregate()
    .lookup({
      from: "seongdos",
      localField: "seongdoId",
      foreignField: "_id",
      as: "seongdoId",
      pipeline: [{ $match: seongdoMatch }],
    })
    .unwind("seongdoId")
    .match(simbangMatch)
    .count("total")

  let total = totalArray.length > 0 ? totalArray[0].total : 0

  return json({
    simbangs,
    page: {
      totalSize: total,
      totalPage: Math.ceil(total / take),
      requestPage: page,
      requestSize: simbangs.length,
      requestParams: {
        name,
        jikbun,
        order,
        group1,
        group2,
        dateStart,
        dateEnd,
        take,
        simbangja,
      },
    },
  })
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
