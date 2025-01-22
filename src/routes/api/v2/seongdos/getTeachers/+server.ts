import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")
  const count = url.searchParams.get("count")
  let seongdoMatch = {}

  if (group1 == "교회학교" && !group2) {
    seongdoMatch = {
      $and: [
        { "services.group1": group1 },
        { "services.classification": { $ne: "" } },
      ],
    }
  } else {
    seongdoMatch = { "services.group1": group1, "services.group2": group2 }
  }

  const seongdos = await Seongdo.aggregate([
    {
      $project: {
        name: 1,
        jikbun: 1,
        birth: 1,
        group1: 1,
        group2: 1,
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
            cond: {
              $and: [
                group1 == "교회학교" && !group2
                  ? { $eq: ["$$data.group1", group1] }
                  : { $eq: ["$$data.group2", group2] },
                {
                  $or: [
                    {
                      $eq: ["$$data.startYear", new Date().getFullYear()],
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
  ]).match(seongdoMatch)

  if (count) {
    return json({ count: seongdos.length })
  } else {
    return json({ seongdos })
  }
}
