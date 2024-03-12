import { BLOB_READ_WRITE_TOKEN } from "$lib/env"
import type { ISeongdo } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth, getGroupItem } from "$lib/utils"
import { dataURItoBlob } from "$lib/utils/canvasUtils"
import { json, type RequestHandler } from "@sveltejs/kit"
import { put, del } from "@vercel/blob"

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

  let seongdoMatch: any = {}
  if (name) {
    seongdoMatch.name = { $regex: name }
  }
  if (jikbun?.length > 0) {
    seongdoMatch.jikbun = { $in: jikbun }
  }
  if (birthStart) {
    if (birthEnd) {
      seongdoMatch.birth = { $gte: birthStart, $lte: birthEnd }
    } else {
      seongdoMatch.birth = { $gte: birthStart }
    }
  } else if (birthEnd) {
    seongdoMatch.birth = { $lte: birthEnd }
  }

  let aggregateSort: any = {}
  switch (order) {
    case "nameAsc":
      aggregateSort = { name: 1, _id: 1 }
      break
    case "nameDesc":
      aggregateSort = { name: -1, _id: 1 }
      break
    case "birthAsc":
      aggregateSort = { hasBirth: -1, birth: 1, _id: 1 }
      break
    case "birthDesc":
      aggregateSort = { hasBirth: -1, birth: -1, _id: 1 }
      break
    case "ageAsc":
      aggregateSort = { hasBirth: -1, birth: -1, _id: 1 }
      break
    case "ageDesc":
      aggregateSort = { hasBirth: -1, birth: 1, _id: 1 }
      break
    case "groupAsc":
      if (group1 == "교회학교") {
        aggregateSort = { groupWithService: 1, "services.order": -1, _id: 1 }
      } else {
        aggregateSort = { group1: 1, group2: 1, "services.order": -1, _id: 1 }
      }
      break
    case "groupDesc":
      if (group1 == "교회학교") {
        aggregateSort = { groupWithService: -1, "services.order": -1, _id: 1 }
      } else {
        aggregateSort = { group1: -1, group2: -1, "services.order": -1, _id: 1 }
      }
      break
    default:
      if (group1 == "장년부") {
        aggregateSort = {
          orderValue: -1,
          group2: 1,
          "services.order": -1,
          name: 1,
        }
      } else if (group1 == "교회학교" || group1 == "청년부") {
        aggregateSort = {
          "services.order": -1,
          updatedAt: -1,
          _id: 1,
        }
      } else {
        aggregateSort = { updatedAt: -1, _id: 1 }
      }
      break
  }

  if (group1 == "기타") {
    if (group2 == "미분류") {
      seongdoMatch["$or"] = [{ group1: "" }, { group1: undefined }]
    } else if (group2) {
      seongdoMatch = { group1, group2 }
    } else {
      seongdoMatch["$or"] = [
        { group1: "" },
        { group1: undefined },
        { group1, group2: { $in: ["별명부", "재적"] } },
      ]
    }
  } else {
    if (group1 && group2) {
      if (group1 == "장년부") {
        seongdoMatch.group1 = group1
        seongdoMatch.group2 = { $regex: group2 }
      } else {
        seongdoMatch["$or"] = [
          { group1, group2 },
          { "services.group1": group1, "services.group2": group2 },
        ]
      }
    } else if (group1) {
      if (group1 == "장년부") {
        seongdoMatch.group1 = group1
      } else {
        seongdoMatch["$or"] = [{ group1 }, { "services.group1": group1 }]
      }
    }
  }

  const seongdos = await Seongdo.aggregate(
    ["장년부", "청년부", "교회학교"].includes(group1 as string)
      ? [
          {
            $project: {
              name: 1,
              // avatar: 1,
              avatarVercelBlob: 1,
              gender: 1,
              singeup: 1,
              jikbun: 1,
              birth: 1,
              age: 1,
              phone: 1,
              group1: 1,
              group2: 1,
              address: 1,
              services: {
                $filter: {
                  input: {
                    $cond: {
                      if: {
                        $eq: [
                          {
                            $type: "$services",
                          },
                          "array",
                        ],
                      },
                      then: "$services",
                      else: ["$services"],
                    },
                  },
                  as: "data",
                  cond:
                    group2 && group1 != "장년부"
                      ? {
                          $and: [
                            { $eq: ["$$data.group1", group1] },
                            { $eq: ["$$data.group2", group2] },
                          ],
                        }
                      : { $eq: ["$$data.group1", group1] },
                },
              },
            },
          },
        ]
      : []
  )

    .addFields({
      temp: { $max: "$services.order" },
    })
    .addFields({
      orderValue: {
        $cond: {
          if: {
            $gt: ["$temp", 7],
          },
          then: { $multiply: ["$temp", 10] },
          else: 0,
        },
      },
    })
    .addFields(
      order?.startsWith("birth") || order?.startsWith("age")
        ? {
            hasBirth: {
              $cond: [{ $eq: ["$birth", ""] }, false, true],
            },
          }
        : { undefined }
    )
    .addFields(
      order?.startsWith("group") && group1 == "교회학교"
        ? {
            groupWithService: {
              $cond: {
                if: { $ne: ["$group1", "교회학교"] },

                then: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: [{ $min: "$services.group2" }, "영아부"] },
                        then: 1,
                      },
                      {
                        case: { $eq: [{ $min: "$services.group2" }, "유치부"] },
                        then: 2,
                      },
                      {
                        case: { $eq: [{ $min: "$services.group2" }, "유년부"] },
                        then: 3,
                      },
                      {
                        case: { $eq: [{ $min: "$services.group2" }, "초등부"] },
                        then: 4,
                      },
                      {
                        case: { $eq: [{ $min: "$services.group2" }, "중등부"] },
                        then: 5,
                      },
                      {
                        case: { $eq: [{ $min: "$services.group2" }, "고등부"] },
                        then: 6,
                      },
                      {
                        case: {
                          $eq: [{ $min: "$services.group2" }, "은혜브릿지"],
                        },
                        then: 7,
                      },
                      {
                        case: {
                          $eq: [{ $min: "$services.group2" }, "늘푸른부"],
                        },
                        then: 8,
                      },
                    ],
                    default: 0,
                  },
                },
                else: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$group2", "영아부"] },
                        then: 1,
                      },
                      {
                        case: { $eq: ["$group2", "유치부"] },
                        then: 2,
                      },
                      {
                        case: { $eq: ["$group2", "유년부"] },
                        then: 3,
                      },
                      {
                        case: { $eq: ["$group2", "초등부"] },
                        then: 4,
                      },
                      {
                        case: { $eq: ["$group2", "중등부"] },
                        then: 5,
                      },
                      {
                        case: { $eq: ["$group2", "고등부"] },
                        then: 6,
                      },
                      {
                        case: {
                          $eq: ["$group2", "은혜브릿지"],
                        },
                        then: 7,
                      },
                      {
                        case: {
                          $eq: ["$group2", "늘푸른부"],
                        },
                        then: 8,
                      },
                    ],
                    default: 0,
                  },
                },
              },
            },
          }
        : { undefined }
    )

    .match(seongdoMatch)
    .sort(aggregateSort)
    .skip((page - 1) * take)
    .limit(take)
    .collation({ locale: "en_US", numericOrdering: true })
    .project({
      _id: 1,
      name: 1,
      // avatar: 1,
      avatarVercelBlob: 1,
      jikbun: 1,
      birth: 1,
      services: 1,
      age: 1,
      phone: 1,
      group1: 1,
      group2: 1,
      address: 1,
    })

  const total = await Seongdo.count(seongdoMatch)

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
  const { seongdos, update, croppedImage, ...rest } = await request.json()
  let url
  if (seongdos) {
    if (update) {
      await Promise.all(
        seongdos.map(async (item) => {
          let seongdo: ISeongdo = item
          let keys = Object.keys(seongdo) as Array<keyof typeof seongdo>
          let values = Object.values(seongdo)
          let updateObject: any = {}
          keys.map((item, idx) => {
            {
              updateObject[keys[idx]] = values[idx]
            }
          })
          updateObject["age"] = getAgeFromBirth(updateObject.birth)

          await Seongdo.updateOne(
            { name: seongdo.name },
            { $set: updateObject }
          )
        })
      )
      return json({ success: true })
    } else {
      seongdos.map((seongdo) => {
        // seongdo.originalName = seongdo.name
        if (seongdo.birth) {
          seongdo.age = getAgeFromBirth(seongdo.birth)
        }
      })

      const result = await Seongdo.create(seongdos)
      return json({ seongdos: result })
    }
  } else {
    if (croppedImage) {
      const blob = dataURItoBlob(croppedImage)
      const result = await put(`${rest.name}.jpeg`, blob, {
        access: "public",
        token: BLOB_READ_WRITE_TOKEN,
      })
      url = result.url
    }
    const seongdo = await Seongdo.create({
      avatarVercelBlob: url,
      ...rest,
    })

    return json({ seongdo })
  }
}

export async function PUT({ request }) {
  let { _id, name, avatarVercelBlob, thumb, ...rest } = await request.json()
  console.log(thumb, name, "here")

  if (thumb) {
    if (avatarVercelBlob) {
      await del(avatarVercelBlob, { token: BLOB_READ_WRITE_TOKEN })
    }
    const blob = dataURItoBlob(thumb)
    const result = await put(`${name}.jpeg`, blob, {
      access: "public",
      token: BLOB_READ_WRITE_TOKEN,
    })
    avatarVercelBlob = result.url
  } else {
    if (avatarVercelBlob) {
      await del(avatarVercelBlob, { token: BLOB_READ_WRITE_TOKEN })
    }
    avatarVercelBlob = ""
  }

  const { upsertedCount, modifiedCount } = await Seongdo.updateOne(
    { _id },
    {
      name,
      avatarVercelBlob,
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
  const { id: _id, ids } = await request.json()

  if (ids) {
    const result = await Seongdo.deleteMany({ _id: { $in: ids } })
    if (result.deletedCount > 0) {
      return json({ success: true })
    } else {
      return json({ success: false })
    }
  } else {
    const result = await Seongdo.deleteOne({ _id })
    if (result.deletedCount == 1) {
      return json({ success: true })
    } else {
      return json({ success: false })
    }
  }
}
