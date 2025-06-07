import type { IGroup } from "$lib/interfaces"
import { Family } from "$lib/models/Family"
import { Seongdo } from "$lib/models/Seongdo"
import { redirect } from "@sveltejs/kit"

const getIGroupItem = (obj: any) => {
  let item: IGroup = { ...obj }
  return item
}

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
  const name = url.searchParams.get("name")
  const phone = url.searchParams.get("phone")
  const jikbun = JSON.parse(url.searchParams.get("jikbun"))
  const singeup = JSON.parse(url.searchParams.get("singeup"))
  const gender = url.searchParams.get("gender")
  const order = url.searchParams.get("order")
  const page =
    url.searchParams.get("page") == ""
      ? 1
      : url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")
  const birthStart = url.searchParams.get("birthStart")
  const birthEnd = url.searchParams.get("birthEnd")
  const showTeacher = url.searchParams.get("showTeacher")

  const getTeacherCount = async (group1: string, group2: string) => {
    let response = await fetch(
      `/api/v2/seongdos/getTeachers?group1=${group1}&group2=${group2}&count=true`
    )
    const result = await response.json()
    return result.count
  }

  if (
    (group1 != null &&
      group1 != "장년부" &&
      group1 != "청년부" &&
      group1 != "교회학교" &&
      group1 != "교역자" &&
      group1 != "기타") ||
    (group1 == null && group2 != null)
  ) {
    throw redirect(303, "/seongdos")
  }

  locals.searchParams = {
    name,
    phone,
    jikbun,
    singeup,
    gender,
    order,
    page,
    group1,
    group2,
    birthStart,
    birthEnd,
    showTeacher,
  }

  let groupTree: IGroup | null = null

  const response = await fetch(
    `/api/v2/seongdos/getGroupTreeWithCount?group1=${group1}`
  )

  const treeCount = await response.json()

  if (group1 == "장년부") {
    groupTree = {
      name: "장년부",
      count: treeCount["장년부"] || 0,
      child: [
        {
          name: "1교구",
          count: treeCount["1교구"] || 0,
          child: [
            ...(await Promise.all(
              ("" + Array(30)).split(",").map(async (item, idx) => {
                if (treeCount[`1교구,${idx + 1}구역`]) {
                  return getIGroupItem({
                    name: `${idx + 1}구역`,
                    count: treeCount[`1교구,${idx + 1}구역`],
                    child: [],
                  })
                } else {
                  return getIGroupItem({})
                }
              })
            )),
            getIGroupItem({
              name: `청년`,
              count: treeCount[`1교구,청년`] || 0,
              child: [],
            }),
          ],
        },
        {
          name: "2교구",
          count: treeCount["2교구"] || 0,
          child: [
            ...(await Promise.all(
              ("" + Array(30)).split(",").map(async (item, idx) => {
                if (treeCount[`2교구,${idx + 1}구역`]) {
                  return getIGroupItem({
                    name: `${idx + 1}구역`,
                    count: treeCount[`2교구,${idx + 1}구역`],
                    child: [],
                  })
                } else {
                  return getIGroupItem({})
                }
              })
            )),
            getIGroupItem({
              name: `청년`,
              count: treeCount[`2교구,청년`] || 0,
              child: [],
            }),
          ],
        },
        {
          name: "3교구",
          count: treeCount["3교구"] || 0,
          child: [
            ...(await Promise.all(
              ("" + Array(30)).split(",").map(async (item, idx) => {
                if (treeCount[`3교구,${idx + 1}구역`]) {
                  return getIGroupItem({
                    name: `${idx + 1}구역`,
                    count: treeCount[`3교구,${idx + 1}구역`],
                    child: [],
                  })
                } else {
                  return getIGroupItem({})
                }
              })
            )),
            getIGroupItem({
              name: `청년`,
              count: treeCount[`3교구,청년`] || 0,
              child: [],
            }),
          ],
        },
      ],
    }
  } else if (group1 == "청년부") {
    groupTree = {
      name: "청년부",
      count: treeCount["청년부"],
      child: [
        {
          name: "1청년",
          count: treeCount["1청년"],
          child: [],
          teacherCount: await Seongdo.count({
            $and: [
              { "services.group1": "청년부", "services.group2": "1청년" },
              {
                $or: [
                  {
                    "services.startYear": { $eq: new Date().getFullYear() },
                  },
                  {
                    $and: [
                      { "services.startYear": { $ne: null } },
                      { "services.endYear": { $eq: null } },
                    ],
                  },
                ],
              },
            ],
          }),
        },
        {
          name: "2청년",
          count: treeCount["2청년"],
          child: [],
          teacherCount: await Seongdo.count({
            $and: [
              { "services.group1": "청년부", "services.group2": "2청년" },
              {
                $or: [
                  {
                    "services.startYear": { $eq: new Date().getFullYear() },
                  },
                  {
                    $and: [
                      { "services.startYear": { $ne: null } },
                      { "services.endYear": { $eq: null } },
                    ],
                  },
                ],
              },
            ],
          }),
        },
      ],
      teacherCount: await Seongdo.count({
        $and: [
          { "services.group1": "청년부" },
          {
            $or: [
              {
                "services.startYear": { $eq: new Date().getFullYear() },
              },
              {
                $and: [
                  { "services.startYear": { $ne: null } },
                  { "services.endYear": { $eq: null } },
                ],
              },
            ],
          },
        ],
      }),
    }
  } else if (group1 == "교회학교") {
    groupTree = {
      name: "교회학교",
      count:
        treeCount["교회학교"] +
          (await Seongdo.count().where({
            "services.group1": "교회학교",
            "services.group2": "은혜브릿지",
          })) +
          (await Seongdo.count().where({
            "services.group1": "교회학교",
            "services.group2": "늘푸른부",
          })) || 0,
      child: [
        {
          name: "영아부",
          count: treeCount["영아부"] || 0,
          child: [],
          teacherCount: await getTeacherCount("교회학교", "영아부"),
        },
        {
          name: "유치부",
          count: treeCount["유치부"] || 0,
          child: [],
          teacherCount: await getTeacherCount("교회학교", "유치부"),
        },
        {
          name: "유년부",
          count: treeCount["유년부"] || 0,
          child: [],
          teacherCount: await getTeacherCount("교회학교", "유년부"),
        },
        {
          name: "초등부",
          count: treeCount["초등부"] || 0,
          child: [],
          teacherCount: await getTeacherCount("교회학교", "초등부"),
        },
        {
          name: "중등부",
          count: treeCount["중등부"] || 0,
          child: [],
          teacherCount: await getTeacherCount("교회학교", "중등부"),
        },
        {
          name: "고등부",
          count: treeCount["고등부"] || 0,
          child: [],
          teacherCount: await getTeacherCount("교회학교", "고등부"),
        },
        {
          name: "은혜브릿지",
          count: await Seongdo.count().where({
            "services.group1": "교회학교",
            "services.group2": "은혜브릿지",
          }),
          child: [],
        },
        {
          name: "늘푸른부",
          count: await Seongdo.count().where({
            "services.group1": "교회학교",
            "services.group2": "늘푸른부",
          }),
          child: [],
        },
      ],
      teacherCount: await getTeacherCount("교회학교", ""),
    }
  } else if (group1 == "교역자") {
    groupTree = {
      name: "교역자",
      count: treeCount["교역자"] || 0,
      child: [
        {
          name: "원로목사",
          count: treeCount["원로목사"] || 0,
          child: [],
        },
        {
          name: "담임목사",
          count: treeCount["담임목사"] || 0,
          child: [],
        },
        {
          name: "목사",
          count: treeCount["목사"] || 0,
          child: [],
        },
        {
          name: "사모",
          count: treeCount["사모"] || 0,
          child: [],
        },
        {
          name: "강도사",
          count: treeCount["강도사"] || 0,
          child: [],
        },
        {
          name: "전임전도사",
          count: treeCount["전임전도사"] || 0,
          child: [],
        },
        {
          name: "교육전도사",
          count: treeCount["교육전도사"] || 0,
          child: [],
        },
      ],
    }
  } else if (group1 == "기타") {
    groupTree = {
      name: "기타",
      count: await Seongdo.count().where({
        $or: [
          { group1: "" },
          { group1: undefined },
          { group1, group2: { $in: ["소천", "제적"] } },
        ],
      }),
      child: [
        {
          name: "소천",
          count: await Seongdo.count({ group1: "기타", group2: "소천" }),
          child: [],
        },
        {
          name: "제적",
          count: await Seongdo.count({ group1: "기타", group2: "제적" }),
          child: [],
        },
        {
          name: "미분류",
          count: await Seongdo.count().where({
            $or: [{ group1: "" }, { group1: undefined }],
          }),
          child: [],
        },
      ],
    }
  }

  // const stuWithFamily = await Family.aggregate()
  //   .lookup({
  //     from: "seongdos",
  //     localField: "memberIds",
  //     foreignField: "_id",
  //     as: "memberIds",
  //     pipeline: [{ $match: { group1: "교회학교" } }],
  //   })
  //   .unwind("memberIds")
  //   .project({
  //     memberIds: {
  //       name: 1,
  //       group1: 1,
  //       group2: 1,
  //     },
  //   })
  //   .count("count")

  if (groupTree) {
    return {
      searchParams: {
        name,
        phone,
        jikbun,
        singeup,
        gender,
        order,
        page,
        group1,
        group2,
        birthStart,
        birthEnd,
        showTeacher,
      },
      groupTree,
      // stuWithFamilyCount: stuWithFamily[0].count,
    }
  } else {
    return {
      searchParams: {
        name,
        phone,
        jikbun,
        singeup,
        gender,
        order,
        page,
        group1,
        group2,
        birthStart,
        birthEnd,
        showTeacher,
      },
      // stuWithFamilyCount: stuWithFamily[0].count,
    }
  }
}
