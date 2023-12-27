import type { ISeongdoEduSearchParams } from "$lib/interfaces"
import { SeongdoEdu } from "$lib/models/SeongdoEdu"
import { json, type RequestHandler } from "@sveltejs/kit"
import { Aggregate } from "mongoose"

export const GET: RequestHandler = async ({ request, url }) => {
  let page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1
  let take =
    url.searchParams.get("take") != null
      ? parseInt(url.searchParams.get("take"))
      : 12
  const name = url.searchParams.get("name")
  const jikbun =
    url.searchParams.get("jikbun") != null
      ? JSON.parse(url.searchParams.get("jikbun"))
      : null
  const order = url.searchParams.get("order")
  const className = url.searchParams.get("class")
  const birthStart = url.searchParams.get("birthStart")
  const birthEnd = url.searchParams.get("birthEnd")

  const educationId = url.searchParams.get("educationId")
  const seongdoId = url.searchParams.get("seongdoId")

  let aggregateSort
  switch (order) {
    case "nameAsc":
      aggregateSort = { "seongdo.name": 1, _id: 1 }
      break
    case "nameDesc":
      aggregateSort = { "seongdo.name": -1, _id: 1 }
      break
    case "birthAsc":
      aggregateSort = { "seongdo.birth": 1, _id: 1 }
      break
    case "birthDesc":
      aggregateSort = { "seongdo.birth": -1, _id: 1 }
      break
    default:
      aggregateSort = { "education.startDate": -1, _id: 1 }
      break
  }

  let seongdoMatch: any = {},
    educationMatch: ISeongdoEduSearchParams = {}

  if (name) {
    seongdoMatch.name = { $regex: name }
  }
  if (jikbun) {
    seongdoMatch.jikbun = { $in: jikbun }
  }
  if (birthStart) {
    seongdoMatch.birth = { $gte: birthStart }
  }
  if (birthStart) {
    seongdoMatch.birth = { ...seongdoMatch.birth, $lte: birthEnd }
  }
  console.log(seongdoMatch)

  if (className && className != "전체") {
    educationMatch.name = className
  }

  let seongdoEdus, total

  if (educationId) {
    let query = SeongdoEdu.find({ education: educationId })
    if (seongdoId) {
      query = query.find({ seongdo: seongdoId })
    }
    seongdoEdus = await SeongdoEdu.find(query)
      .skip((page - 1) * take)
      .limit(take)
      .populate("seongdo")
      .populate("education")
    total = await SeongdoEdu.count(query)
  } else {
    seongdoEdus = await SeongdoEdu.aggregate()
      .lookup({
        from: "seongdos",
        localField: "seongdo",
        foreignField: "_id",
        as: "seongdo",
        pipeline: [{ $match: seongdoMatch }],
      })
      .unwind("seongdo")
      .lookup({
        from: "educations",
        localField: "education",
        foreignField: "_id",
        as: "education",
        pipeline: [{ $match: educationMatch }],
      })
      .unwind("education")
      .sort(aggregateSort)
      .skip((page - 1) * take)
      .limit(take)

    const totalArray = await SeongdoEdu.aggregate()

      .lookup({
        from: "seongdos",
        localField: "seongdo",
        foreignField: "_id",
        as: "seongdo",
        pipeline: [{ $match: seongdoMatch }],
      })
      .unwind("seongdo")
      .lookup({
        from: "educations",
        localField: "education",
        foreignField: "_id",
        as: "education",
        pipeline: [{ $match: educationMatch }],
      })
      .unwind("education")
      .count("total")

    total = totalArray.length > 0 ? totalArray[0].total : 0
  }

  return json({
    seongdoEdus,
    page: {
      totalSize: total,
      totalPage: Math.ceil(total / take),
      requestPage: page,
      requestSize: seongdoEdus.length,
      requestParams: {
        name,
        jikbun,
        className,
        order,
        take,
        seongdoId,
        educationId,
      },
    },
  })
}

export const POST: RequestHandler = async ({ request, url }) => {
  const body = await request.json()

  const seongdoEdu = await SeongdoEdu.create({ ...body })
  if (seongdoEdu) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}

export const DELETE: RequestHandler = async ({ request, url }) => {
  const { seongdo, education } = await request.json()

  const result = await SeongdoEdu.deleteOne({
    seongdo,
    education,
  })
  if (result.deletedCount == 1) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
