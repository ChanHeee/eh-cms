import { JWT_SECRET } from "$lib/env"
import type { IGroup } from "$lib/interfaces"
import { redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
  const getSeongdoCount = async (data: {
    group1?: string
    group2?: string
  }) => {
    const { group1, group2 } = data
    const response = await fetch("/api/seongdos/count", {
      method: "POST",
      body: JSON.stringify({
        group1,
        group2,
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const { count } = await response.json()
    return count
  }

  const name = url.searchParams.get("name")
  const jikbun = JSON.parse(url.searchParams.get("jikbun"))
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

  if (
    (group1 != null &&
      group1 != "장년부" &&
      group1 != "청년부" &&
      group1 != "교회학교") ||
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
    birthStart,
    birthEnd,
  }

  let groupTree: IGroup | null = null

  if (group1 == "장년부") {
    groupTree = {
      name: "장년부",
      count: await getSeongdoCount({ group1: "장년부" }),
      child: [
        {
          name: "1교구",
          count: await getSeongdoCount({ group2: "1교구" }),
          child: await Promise.all(
            ("" + Array(19)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: await getSeongdoCount({
                  group2: `1교구,${idx + 1}구역`,
                }),
                child: [],
              }
            })
          ),
        },
        {
          name: "2교구",
          count: await getSeongdoCount({ group2: "2교구" }),
          child: await Promise.all(
            ("" + Array(20)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: await getSeongdoCount({
                  group2: `2교구,${idx + 1}구역`,
                }),
                child: [],
              }
            })
          ),
        },
        {
          name: "3교구",
          count: await getSeongdoCount({ group2: "3교구" }),
          child: await Promise.all(
            ("" + Array(18)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: await getSeongdoCount({
                  group2: `3교구,${idx + 1}구역`,
                }),
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
      count: await getSeongdoCount({ group1: "청년부" }),
      child: [
        {
          name: "1청년",
          count: await getSeongdoCount({ group2: "1청년" }),
          child: [],
        },
        {
          name: "2청년",
          count: await getSeongdoCount({ group2: "2청년" }),
          child: [],
        },
      ],
    }
  } else if (group1 == "교회학교") {
    groupTree = {
      name: "교회학교",
      count: await getSeongdoCount({ group1: "교회학교" }),
      child: [
        {
          name: "영아부",
          count: await getSeongdoCount({ group2: "영아부" }),
          child: [],
        },
        {
          name: "유치부",
          count: await getSeongdoCount({ group2: "유치부" }),
          child: [],
        },
        {
          name: "유년부",
          count: await getSeongdoCount({ group2: "유년부" }),
          child: [],
        },
        {
          name: "초등부",
          count: await getSeongdoCount({ group2: "초등부" }),
          child: [],
        },
        {
          name: "중등부",
          count: await getSeongdoCount({ group2: "중등부" }),
          child: [],
        },
        {
          name: "고등부",
          count: await getSeongdoCount({ group2: "고등부" }),
          child: [],
        },
        {
          name: "은혜브릿지",
          count: await getSeongdoCount({ group2: "은혜브릿지" }),
          child: [],
        },
        {
          name: "늘푸른부",
          count: await getSeongdoCount({ group2: "늘푸른부" }),
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
        birthStart,
        birthEnd,
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
        birthStart,
        birthEnd,
      },
    }
  }
}
