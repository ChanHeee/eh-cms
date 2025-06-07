import type { IGroup } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { SeongdoEdu } from "$lib/models/SeongdoEdu"
import { getGroupList } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
  const className = decodeURI(url.pathname).split("/")[2]
  const semester = url.searchParams.get("semester")
  const name = url.searchParams.get("name")
  const jikbun = JSON.parse(url.searchParams.get("jikbun"))
  const birthStart = url.searchParams.get("birthStart")
  const birthEnd = url.searchParams.get("birthEnd")
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")
  const order = url.searchParams.get("order")
  const page =
    url.searchParams.get("page") == ""
      ? 1
      : url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1

  const { allowedGroup } = locals

  locals.searchParams = {
    name,
    jikbun,
    order,
    page,
    birthStart,
    birthEnd,
    group1,
    group2,
    semester,
  }

  let groupTree: IGroup | null = null

  const getEduCount = async (name?: String, semester?: String) => {
    let eduMatch: any = {}

    if (name == "통합") {
      eduMatch["semester"] = "통합"
      if (semester) {
        eduMatch["name"] = semester
      }
    } else if (name) {
      eduMatch = { $and: [{ name }, { semester: { $ne: "통합" } }] }
      if (semester) {
        eduMatch["semester"] = semester
      }
    }

    const totalArray = await SeongdoEdu.aggregate()
      .lookup({
        from: "seongdos",
        localField: "seongdo",
        foreignField: "_id",
        as: "seongdo",
      })
      .unwind("seongdo")
      .lookup({
        from: "educations",
        localField: "education",
        foreignField: "_id",
        as: "education",
        pipeline: [{ $match: eduMatch }],
      })
      .unwind("education")
      .count("total")

    return totalArray.length > 0 ? totalArray[0].total : 0
  }

  // if (!className || className == "전체") {
  // } else

  if (className == "기초반") {
    groupTree = {
      name: "기초반",
      count: await getEduCount("기초반"),
      child: [
        {
          name: "1학기",
          count: await getEduCount("기초반", "1학기"),
          child: [],
        },
        {
          name: "2학기",
          count: await getEduCount("기초반", "2학기"),
          child: [],
        },
      ],
    }
  } else if (className == "성숙반") {
    groupTree = {
      name: "성숙반",
      count: await getEduCount("성숙반"),
      child: [
        {
          name: "큐티학교",
          count: await getEduCount("성숙반", "큐티학교"),
          child: [],
        },
        {
          name: "기독교교양",
          count: await getEduCount("성숙반", "기독교교양"),
          child: [],
        },
        {
          name: "구약개관",
          count: await getEduCount("성숙반", "구약개관"),
          child: [],
        },
      ],
    }
  } else if (className == "사명자반") {
    groupTree = {
      name: "사명자반",
      count: await getEduCount("사명자반"),
      child: [
        {
          name: "기도학교",
          count: await getEduCount("사명자반", "기도학교"),
          child: [],
        },
        {
          name: "선교학교",
          count: await getEduCount("사명자반", "선교학교"),
          child: [],
        },
      ],
    }
  } else if (className == "통합") {
    groupTree = {
      name: "통합",
      count: await getEduCount("통합"),
      child: [
        {
          name: "기초반",
          count: await getEduCount("통합", "기초반"),
          child: [],
        },
        {
          name: "열매반",
          count: await getEduCount("통합", "열매반"),
          child: [],
        },
        {
          name: "청지기반",
          count: await getEduCount("통합", "청지기반"),
          child: [],
        },
      ],
    }
  } else {
    groupTree = {
      name: "전체",
      count: await getEduCount(),
      child: [
        {
          name: "기초반",
          count: await getEduCount("기초반"),
          child: [],
        },
        {
          name: "성숙반",
          count: await getEduCount("성숙반"),
          child: [],
        },
        {
          name: "사명자반",
          count: await getEduCount("사명자반"),
          child: [],
        },
        {
          name: "통합",
          count: await getEduCount("통합"),
          child: [],
        },
      ],
    }
  }

  return {
    searchParams: {
      name,
      jikbun,
      order,
      page,
      className,
      semester,
      birthStart,
      birthEnd,
      group1,
      group2,
    },
    groupList: getGroupList(allowedGroup),
    groupTree,
  }
}
