import { JWT_SECRET } from "$lib/env"
import type { IGroup } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
  const name = url.searchParams.get("name")
  const jikbun = JSON.parse(url.searchParams.get("jikbun"))
  const simbangja = JSON.parse(url.searchParams.get("simbangja"))
  const order = url.searchParams.get("order")
  const page =
    url.searchParams.get("page") == ""
      ? 1
      : url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")
  const dateStart = url.searchParams.get("dateStart")
  const dateEnd = url.searchParams.get("dateEnd")

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
    jikbun,
    order,
    page,
    group1,
    group2,
    dateStart,
    dateEnd,
  }

  let groupTree: IGroup | null = null

  if (group1 == "장년부") {
    groupTree = {
      name: "장년부",
      count: 0,
      child: [
        {
          name: "1교구",
          count: 0,
          child: await Promise.all(
            ("" + Array(30)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: await Seongdo.count({
                  group1: "장년부",
                  group2: `1교구,${idx + 1}구역`,
                }),
                child: [],
              }
            })
          ),
        },
        {
          name: "2교구",
          count: 0,
          child: await Promise.all(
            ("" + Array(30)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: 0,
                child: [],
              }
            })
          ),
        },
        {
          name: "3교구",
          count: 0,
          child: await Promise.all(
            ("" + Array(30)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: 0,
                child: [],
              }
            })
          ),
        },
      ],
    }
  } else if (group1 == "청년부") {
    groupTree = {
      name: "청년부",
      count: 0,
      child: [
        {
          name: "1청년",
          count: 0,
          child: [],
        },
        {
          name: "2청년",
          count: 0,
          child: [],
        },
      ],
    }
  } else if (group1 == "교회학교") {
    groupTree = {
      name: "교회학교",
      count: 0,
      child: [
        {
          name: "영아부",
          count: 0,
          child: [],
        },
        {
          name: "유치부",
          count: 0,
          child: [],
        },
        {
          name: "유년부",
          count: 0,
          child: [],
        },
        {
          name: "초등부",
          count: 0,
          child: [],
        },
        {
          name: "중등부",
          count: 0,
          child: [],
        },
        {
          name: "고등부",
          count: 0,
          child: [],
        },
        {
          name: "은혜브릿지",
          count: 0,
          child: [],
        },
        {
          name: "늘푸른부",
          count: 0,
          child: [],
        },
      ],
    }
  }

  if (groupTree) {
    return {
      searchParams: {
        name,
        jikbun,
        order,
        page,
        group1,
        group2,
        dateStart,
        dateEnd,
      },
      groupTree,
    }
  } else {
    return {
      searchParams: {
        name,
        jikbun,
        order,
        page,
        group1,
        group2,
        dateStart,
        dateEnd,
        simbangja,
      },
    }
  }
}
