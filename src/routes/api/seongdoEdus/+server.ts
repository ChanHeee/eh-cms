import type { ISeongdoEduSearchParams } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { SeongdoEdu } from "$lib/models/SeongdoEdu"
import { json, type RequestHandler } from "@sveltejs/kit"
import { Aggregate, Types } from "mongoose"

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
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")

  const educationId = url.searchParams.get("educationId")
  const seongdoId = url.searchParams.get("seongdoId")

  let aggregateSort: any
  switch (order) {
    case "nameAsc":
      aggregateSort = { "seongdo.name": 1, _id: 1 }
      break
    case "nameDesc":
      aggregateSort = { "seongdo.name": -1, _id: 1 }
      break
    case "birthAsc":
      aggregateSort = { hasBirth: -1, "seongdo.birth": 1, _id: 1 }
      break
    case "birthDesc":
      aggregateSort = { hasBirth: -1, "seongdo.birth": -1, _id: 1 }
      break
    case "ageAsc":
      aggregateSort = { hasBirth: -1, "seongdo.birth": -1, _id: 1 }
      break
    case "ageDesc":
      aggregateSort = { hasBirth: -1, "seongdo.birth": 1, _id: 1 }
      break
    case "groupAsc":
      aggregateSort = { "seongdo.group1": 1, "seongdo.group2": 1, _id: 1 }

      break
    case "groupDesc":
      aggregateSort = { "seongdo.group1": -1, "seongdo.group2": -1, _id: 1 }

      break
    case "startDateAsc":
      aggregateSort = { "education.startDate": 1, _id: 1 }
      break
    case "startDateDesc":
      aggregateSort = { "education.startDate": -1, _id: 1 }
      break
    default:
      aggregateSort = { "education.startDate": -1, _id: 1 }
      break
  }

  let seongdoMatch: any = {},
    educationMatch: any = {}

  if (seongdoId) {
    seongdoMatch._id = new Types.ObjectId(seongdoId)
  }
  if (name) {
    seongdoMatch.name = { $regex: name }
  }
  if (jikbun) {
    seongdoMatch.jikbun = { $in: jikbun }
  }
  if (birthStart) {
    seongdoMatch.birth = { $gte: birthStart }
  }
  if (birthEnd) {
    seongdoMatch.birth = { ...seongdoMatch.birth, $lte: birthEnd }
  }
  if (group1) {
    seongdoMatch.group1 = group1
  }
  if (group2) {
    seongdoMatch.group2 = group2
  }

  if (className && className != "전체") {
    educationMatch.name = className
  }
  if (educationId) {
    educationMatch._id = new Types.ObjectId(educationId)
  }

  let seongdoEdus, total

  // if (educationId) {
  //   // let query = SeongdoEdu.find({ education: educationId })
  //   // if (seongdoId) {
  //   //   query = query.find({ seongdo: seongdoId })
  //   // }
  //   // seongdoEdus = await SeongdoEdu.find(query)
  //   //   .skip((page - 1) * take)
  //   //   .limit(take)
  //   //   .populate("seongdo")
  //   //   .populate("education")
  //   let seongdoEduMatch: any = {}
  //   seongdoEduMatch.education = educationId
  //   if (seongdoId) {
  //     seongdoEduMatch.seongdo = seongdoId
  //   }
  //   console.log(educationId)

  //   seongdoEdus = await SeongdoEdu.aggregate()
  //     .match({ _id: "65ceb29ee667a01ec89f3112" })
  //     .exec()

  //   const totalArray = await SeongdoEdu.aggregate()
  //     .match(seongdoEduMatch)
  //     .lookup({
  //       from: "seongdos",
  //       localField: "seongdo",
  //       foreignField: "_id",
  //       as: "seongdo",
  //     })
  //     .unwind("seongdo")
  //     .lookup({
  //       from: "educations",
  //       localField: "education",
  //       foreignField: "_id",
  //       as: "education",
  //     })
  //     .unwind("education")
  //     .count("total")

  //   total = totalArray.length > 0 ? totalArray[0].total : 0

  //   // total = await SeongdoEdu.count(query)
  // } else {
  //   seongdoEdus = await SeongdoEdu.aggregate()
  //     .sort(aggregateSort)
  //     .skip((page - 1) * take)
  //     .limit(take)
  //     .lookup({
  //       from: "seongdos",
  //       localField: "seongdo",
  //       foreignField: "_id",
  //       as: "seongdo",
  //       pipeline: [{ $match: seongdoMatch }],
  //     })
  //     .unwind("seongdo")
  //     .lookup({
  //       from: "educations",
  //       localField: "education",
  //       foreignField: "_id",
  //       as: "education",
  //       pipeline: [{ $match: educationMatch }],
  //     })
  //     .unwind("education")
  //     .project({
  //       _id: 1,
  //       seongdo: {
  //         _id: 1,
  //         name: 1,
  //         jikbun: 1,
  //         birth: 1,
  //         age: 1,
  //         group1: 1,
  //         group2: 1,
  //       },
  //       education: {
  //         name: 1,
  //         semester: 1,
  //         startDate: 1,
  //         endDate: 1,
  //       },
  //     })

  //   const totalArray = await SeongdoEdu.aggregate()
  //     .lookup({
  //       from: "seongdos",
  //       localField: "seongdo",
  //       foreignField: "_id",
  //       as: "seongdo",
  //       pipeline: [{ $match: seongdoMatch }],
  //     })
  //     .unwind("seongdo")
  //     .lookup({
  //       from: "educations",
  //       localField: "education",
  //       foreignField: "_id",
  //       as: "education",
  //       pipeline: [{ $match: educationMatch }],
  //     })
  //     .unwind("education")
  //     .count("total")

  //   total = totalArray.length > 0 ? totalArray[0].total : 0
  // }

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
    .project({
      _id: 1,
      seongdo: {
        _id: 1,
        name: 1,
        jikbun: 1,
        birth: 1,
        phone: 1,
        age: 1,
        group1: 1,
        group2: 1,
      },
      education: {
        _id: 1,
        name: 1,
        teacher: 1,
        day: 1,
        time: 1,
        place: 1,
        semester: 1,
        startDate: 1,
        endDate: 1,
      },
    })
    .addFields(
      order?.startsWith("birth") || order?.startsWith("age")
        ? {
            hasBirth: {
              $cond: [{ $eq: ["$seongdo.birth", ""] }, false, true],
            },
          }
        : { undefined }
    )
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
        birthStart,
        birthEnd,
        group1,
        group2,
      },
    },
  })
}

export const POST: RequestHandler = async ({ request, url }) => {
  const body = await request.json()
  const names = body.names
  const education = body.education

  if (names) {
    let seongdos = await Seongdo.find({ name: { $in: names } })

    Promise.all(
      seongdos.map(async (seongdo) => {
        await SeongdoEdu.create({ seongdo: seongdo._id, education })
      })
    )
    return json({ success: true })
  } else {
    const seongdoEdu = await SeongdoEdu.create({ ...body })
    if (seongdoEdu) {
      return json({ success: true })
    } else {
      return json({ success: false })
    }
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
