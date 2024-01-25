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

  let seongdoMatch: any = {}
  if (name) {
    seongdoMatch.name = { $regex: name }
  }
  if (jikbun?.length > 0) {
    seongdoMatch.jikbun = { $in: jikbun }
  }
  if (birthStart) {
    seongdoMatch.birth = { $gte: birthStart }
  }
  if (birthEnd) {
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
      aggregateSort = { birth: 1, _id: 1 }
      break
    case "birthDesc":
      aggregateSort = { birth: -1, _id: 1 }
      break
    default:
      if (group1 == "장년부") {
        aggregateSort = { "services.order": -1, group1: 1, group2: 1, _id: 1 }
      } else if (group1 == "교회학교" || group1 == "청년부") {
        aggregateSort = { "services.order": -1, _id: 1 }
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
                  cond: { $eq: ["$$data.group1", group1] },
                },
              },
            },
          },
        ]
      : []
  )
    .match(seongdoMatch)
    .sort(aggregateSort)
    .collation({ locale: "en_US", numericOrdering: true })
    .skip((page - 1) * take)
    .limit(take)

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
  const { seongdos, ...rest } = await request.json()

  if (seongdos) {
    seongdos.map((seongdo) => {
      // seongdo.originalName = seongdo.name
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
