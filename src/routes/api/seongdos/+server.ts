import { JWT_SECRET } from "$lib/env"
import type { ISeongdo } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth, getGroupItem } from "$lib/utils"
import { json, type RequestHandler } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

export const GET: RequestHandler = async ({ request, url, locals }) => {
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
  const phone = url.searchParams.get("phone")
  const jikbun =
    url.searchParams.get("jikbun") != null
      ? JSON.parse(url.searchParams.get("jikbun"))
      : []
  const singeup =
    url.searchParams.get("singeup") != null
      ? JSON.parse(url.searchParams.get("singeup"))
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
  // const take = 12
  const take =
    url.searchParams.get("take") != null
      ? parseInt(url.searchParams.get("take"))
      : 12

  const excludeETC = url.searchParams.get("excludeETC")
  const includeStu = url.searchParams.get("includeStu")
  const showTeacher = url.searchParams.get("showTeacher")

  let seongdoMatch: any = {}
  if (excludeETC == "true") {
    seongdoMatch = {
      $and: [
        { group1: { $ne: "" } },
        { group1: { $ne: "기타" } },
        { group2: { $nin: ["소천", "제적"] } },
      ],
    }
  }

  if (name) {
    seongdoMatch.name = { $regex: name }
  }
  if (phone) {
    seongdoMatch.phoneWithoutDash = { $regex: phone }
  }
  if (jikbun?.length > 0) {
    const jikbunTemp = [...jikbun]
    if (jikbun.includes("장로")) {
      jikbunTemp.push(
        "시무장로",
        "무임장로",
        "협동장로",
        "은퇴장로",
        "무임은퇴장로"
      )
    }
    if (jikbun.includes("권사")) {
      jikbunTemp.push("시무권사", "무임권사", "은퇴권사", "무임은퇴권사")
    }
    if (jikbun.includes("장립집사all")) {
      jikbunTemp.push(
        "장립집사",
        "무임장립집사",
        "은퇴장립집사",
        "무임은퇴장립집사"
      )
    }
    if (jikbun.includes("서리집사all")) {
      jikbunTemp.push("서리집사", "명예서리집사")
    }
    seongdoMatch.jikbun = { $in: jikbunTemp }
  }

  if (singeup?.length > 0) {
    seongdoMatch.singeup = { $in: singeup }
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
    case "addressAsc":
      aggregateSort = { hasAddress: -1, address: 1, _id: 1 }
      break
    case "addressDesc":
      aggregateSort = { hasAddress: -1, address: -1, _id: 1 }
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

  if (includeStu == "true" || group1 == "교회학교") {
  } else {
    seongdoMatch.group1 = { $ne: "교회학교" }
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
        { group1, group2: { $in: ["별명부", "제적", "소천"] } },
      ]
    }
  } else {
    if (group1 && group2) {
      if (group1 == "장년부") {
        seongdoMatch.group1 = group1
        seongdoMatch.group2 = { $regex: group2 }
      } else {
        if (group2 == "늘푸른부" || group2 == "은혜브릿지") {
          seongdoMatch = {
            "services.group1": group1,
            "services.group2": group2,
          }
        } else {
          if (showTeacher) {
            seongdoMatch["$or"] = [
              { "services.group1": group1, "services.group2": group2 },
            ]
          } else {
            seongdoMatch.group1 = group1
            seongdoMatch.group2 = { $regex: group2 }
          }

          // seongdoMatch["$or"] = [
          //   showTeacher
          //     ? { "services.group1": group1, "services.group2": group2 }
          //     : { group1, group2 },
          //   // { group1, group2 },
          //   // { "services.group1": group1, "services.group2": group2 },
          // ]
        }
      }
    } else if (group1) {
      if (group1 == "장년부") {
        seongdoMatch.group1 = group1
      } else {
        seongdoMatch["$or"] = [
          showTeacher
            ? {
                $and: [
                  { "services.group1": group1 },
                  { "services.classification": { $ne: "" } },
                ],
              }
            : { group1 },
        ]
      }
    }
  }

  let aggregate = Seongdo.aggregate(
    ["장년부", "청년부", "교회학교"].includes(group1 as string)
      ? [
          {
            $project: {
              name: 1,
              // avatar: 1,
              // avatarVercelBlob: 1,
              gender: 1,
              singeup: 1,
              jikbun: 1,
              enrolled_at: 1,
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
                        $and: [
                          {
                            $eq: [
                              {
                                $type: "$services",
                              },
                              "array",
                            ],
                          },
                        ],
                      },
                      then: "$services",
                      else: ["$services"],
                    },
                  },
                  as: "data",
                  cond:
                    group2 == "늘푸른부" || group2 == "은혜브릿지"
                      ? {
                          $and: [
                            { $eq: ["$$data.group1", group1] },
                            { $eq: ["$$data.group2", group2] },
                          ],
                        }
                      : group2 && group1 != "장년부"
                      ? {
                          $and: [
                            { $eq: ["$$data.group1", group1] },
                            { $eq: ["$$data.group2", group2] },
                            {
                              $or: [
                                {
                                  $eq: [
                                    "$$data.startYear",
                                    new Date().getFullYear(),
                                  ],
                                },
                                {
                                  $and: [
                                    { $ne: ["$$data.startYear", null] },
                                    { $eq: ["$$data.endYear", null] },
                                  ],
                                },
                              ],
                            },
                          ],
                        }
                      : {
                          $and: [
                            { $eq: ["$$data.group1", group1] },
                            {
                              $or: [
                                {
                                  $eq: [
                                    "$$data.startYear",
                                    new Date().getFullYear(),
                                  ],
                                },
                                {
                                  $and: [
                                    { $ne: ["$$data.startYear", null] },
                                    { $eq: ["$$data.endYear", null] },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                },
              },
            },
          },
        ]
      : [],
    { allowDiskUse: true }
  )

  if (phone) {
    aggregate.addFields({
      phoneWithoutDash: {
        $replaceAll: { input: "$phone", find: "-", replacement: "" },
      },
    })
  }

  if (group1 == "장년부" || showTeacher == "true") {
    aggregate
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
  }

  if (order?.startsWith("birth") || order?.startsWith("age")) {
    aggregate.addFields({
      hasBirth: {
        $cond: [{ $eq: ["$birth", ""] }, false, true],
      },
    })
  }

  if (order?.startsWith("group") && group1 == "교회학교") {
    aggregate.addFields({
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
    })
  }

  if (order?.startsWith("address")) {
    aggregate.addFields({
      hasAddress: {
        $cond: [{ $eq: ["$address", ""] }, false, true],
      },
    })
  }

  const seongdos = await aggregate
    .match(seongdoMatch)
    .sort(aggregateSort)
    .skip((page - 1) * take)
    .limit(take)
    .collation({ locale: "en_US", numericOrdering: true })
    .project({
      _id: 1,
      name: 1,
      // avatar: 1,
      gender: 1,
      singeup: 1,
      jikbun: 1,
      enrolled_at: 1,
      birth: 1,
      // services: 1,
      services: {
        $sortArray: { input: "$services", sortBy: { order: -1 } },
      },
      age: 1,
      phone: 1,
      group1: 1,
      group2: 1,
      address: 1,
    })

  // const total = await Seongdo.count(seongdoMatch)

  let total: any

  if (phone) {
    total = await Seongdo.aggregate(
      ["장년부", "청년부", "교회학교"].includes(group1 as string)
        ? [
            {
              $project: {
                name: 1,
                // avatar: 1,
                // avatarVercelBlob: 1,
                gender: 1,
                singeup: 1,
                jikbun: 1,
                enrolled_at: 1,
                birth: 1,
                age: 1,
                phone: 1,
                group1: 1,
                group2: 1,
                address: 1,
                remarks: 1,
                services: {
                  $filter: {
                    input: {
                      $cond: {
                        if: {
                          $and: [
                            {
                              $eq: [
                                {
                                  $type: "$services",
                                },
                                "array",
                              ],
                            },
                          ],
                        },
                        then: "$services",
                        else: ["$services"],
                      },
                    },
                    as: "data",
                    cond:
                      group2 == "늘푸른부" || group2 == "은혜브릿지"
                        ? {
                            $and: [
                              { $eq: ["$$data.group1", group1] },
                              { $eq: ["$$data.group2", group2] },
                            ],
                          }
                        : group2 && group1 != "장년부"
                        ? {
                            $and: [
                              { $eq: ["$$data.group1", group1] },
                              { $eq: ["$$data.group2", group2] },
                              {
                                $or: [
                                  {
                                    $eq: [
                                      "$$data.startYear",
                                      new Date().getFullYear(),
                                    ],
                                  },
                                  {
                                    $and: [
                                      { $ne: ["$$data.startYear", null] },
                                      { $eq: ["$$data.endYear", null] },
                                    ],
                                  },
                                ],
                              },
                            ],
                          }
                        : {
                            $and: [
                              { $eq: ["$$data.group1", group1] },
                              {
                                $or: [
                                  {
                                    $eq: [
                                      "$$data.startYear",
                                      new Date().getFullYear(),
                                    ],
                                  },
                                  {
                                    $and: [
                                      { $ne: ["$$data.startYear", null] },
                                      { $eq: ["$$data.endYear", null] },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                  },
                },
              },
            },
          ]
        : []
    )
      .addFields({
        phoneWithoutDash: {
          $replaceAll: { input: "$phone", find: "-", replacement: "" },
        },
      })
      .match(seongdoMatch)
      .count("total")

    // total = total.length > 0 ? total[0].total : 0
  } else {
    // total = await Seongdo.count(seongdoMatch)
    total = await Seongdo.aggregate(
      ["장년부", "청년부", "교회학교"].includes(group1 as string)
        ? [
            {
              $project: {
                name: 1,
                // avatar: 1,
                // avatarVercelBlob: 1,
                gender: 1,
                singeup: 1,
                jikbun: 1,
                enrolled_at: 1,
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
                          $and: [
                            {
                              $eq: [
                                {
                                  $type: "$services",
                                },
                                "array",
                              ],
                            },
                          ],
                        },
                        then: "$services",
                        else: ["$services"],
                      },
                    },
                    as: "data",
                    cond:
                      group2 == "늘푸른부" || group2 == "은혜브릿지"
                        ? {
                            $and: [
                              { $eq: ["$$data.group1", group1] },
                              { $eq: ["$$data.group2", group2] },
                            ],
                          }
                        : group2 && group1 != "장년부"
                        ? {
                            $and: [
                              { $eq: ["$$data.group1", group1] },
                              { $eq: ["$$data.group2", group2] },
                              {
                                $or: [
                                  {
                                    $eq: [
                                      "$$data.startYear",
                                      new Date().getFullYear(),
                                    ],
                                  },
                                  {
                                    $and: [
                                      { $ne: ["$$data.startYear", null] },
                                      { $eq: ["$$data.endYear", null] },
                                    ],
                                  },
                                ],
                              },
                            ],
                          }
                        : {
                            $and: [
                              { $eq: ["$$data.group1", group1] },
                              {
                                $or: [
                                  {
                                    $eq: [
                                      "$$data.startYear",
                                      new Date().getFullYear(),
                                    ],
                                  },
                                  {
                                    $and: [
                                      { $ne: ["$$data.startYear", null] },
                                      { $eq: ["$$data.endYear", null] },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                  },
                },
              },
            },
          ]
        : []
    )

      .match(seongdoMatch)
      .count("total")
  }
  total = total.length > 0 ? total[0].total : 0

  return json({
    seongdos,
    page: {
      totalSize: total,
      totalPage: Math.ceil(total / take),
      requestPage: page,
      requestSize: seongdos.length,
      requestParams: {
        name,
        phone,
        jikbun,
        singeup,
        order,
        group1,
        group2,
        birthStart,
        birthEnd,
        take,
        showTeacher,
      },
    },
  })
}

export async function POST({ request }) {
  const { seongdos, update, thumb, ...rest } = await request.json()
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
    // if (thumb) {
    //   const blob = dataURItoBlob(thumb)
    //   const result = await put(`${rest.name}.jpeg`, blob, {
    //     access: "public",
    //     token: BLOB_READ_WRITE_TOKEN,
    //   })
    //   url = result.url
    // }
    const seongdo = await Seongdo.create({
      // avatarVercelBlob: url,
      ...rest,
    })

    return json({ seongdo })
  }
}

export async function PUT({ request }) {
  let { _id, address, addressBefore, ...rest } = await request.json()

  let bulkWirteOptions = [
    {
      updateOne: {
        filter: { _id },
        update: {
          address,
          ...rest,
        },
      },
    },
  ]
  if (address != addressBefore) {
    bulkWirteOptions.push({
      updateOne: {
        filter: { _id },
        update: {
          $push: {
            addressHistory: { $each: [addressBefore], $position: 0 },
          },
        },
      },
    })
  }

  const { modifiedCount } = await Seongdo.bulkWrite(bulkWirteOptions)

  if (modifiedCount) {
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
