import type { IGroup } from "$lib/interfaces"
import { redirect } from "@sveltejs/kit"

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

  console.log("seongdos layout.server")

  const name = url.searchParams.get("name")
  const jikbun = JSON.parse(url.searchParams.get("jikbun"))
  const order = url.searchParams.get("order")
  const eduName = url.searchParams.get("eduName")
  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 0
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")

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
    eduName,
    page,
    group1,
    group2,
  }

  let groupTree: IGroup | null = null

  if (group1 == "장년부") {
    groupTree = {
      name: "장년부",
      total: await getSeongdoCount({ group1: "장년부" }),
      child: [
        {
          name: "1구역",
          total: await getSeongdoCount({ group2: "1구역" }),
          child: [
            {
              name: "1교구",
              total: await getSeongdoCount({
                group2: "1구역,1교구",
              }),
              child: [],
            },
            {
              name: "2교구",
              total: await getSeongdoCount({
                group2: "1구역,2교구",
              }),
              child: [],
            },
            {
              name: "3교구",
              total: await getSeongdoCount({
                group2: "1구역,3교구",
              }),
              child: [],
            },
            {
              name: "4교구",
              total: await getSeongdoCount({
                group2: "1구역,4교구",
              }),
              child: [],
            },
          ],
        },
        {
          name: "2구역",
          total: await getSeongdoCount({ group2: "2구역" }),
          child: [
            {
              name: "1교구",
              total: await getSeongdoCount({
                group2: "2구역,1교구",
              }),
              child: [],
            },
            {
              name: "2교구",
              total: await getSeongdoCount({
                group2: "2구역,2교구",
              }),
              child: [],
            },
            {
              name: "3교구",
              total: await getSeongdoCount({
                group2: "2구역,3교구",
              }),
              child: [],
            },
            {
              name: "4교구",
              total: await getSeongdoCount({
                group2: "2구역,4교구",
              }),
              child: [],
            },
          ],
        },
      ],
    }
  } else if (group1 == "청년부") {
    groupTree = {
      name: "청년부",
      total: await getSeongdoCount({ group1: "청년부" }),
      child: [
        {
          name: "1청년",
          total: await getSeongdoCount({ group2: "1청년" }),
          child: [],
        },
        {
          name: "2청년",
          total: await getSeongdoCount({ group2: "2청년" }),
          child: [],
        },
      ],
    }
  } else if (group1 == "교회학교") {
    groupTree = {
      name: "교회학교",
      total: await getSeongdoCount({ group1: "교회학교" }),
      child: [
        {
          name: "영아부",
          total: await getSeongdoCount({ group2: "영아부" }),
          child: [],
        },
        {
          name: "유치부",
          total: await getSeongdoCount({ group2: "유치부" }),
          child: [],
        },
        {
          name: "유년부",
          total: await getSeongdoCount({ group2: "유년부" }),
          child: [],
        },
        {
          name: "초등부",
          total: await getSeongdoCount({ group2: "초등부" }),
          child: [],
        },
        {
          name: "중등부",
          total: await getSeongdoCount({ group2: "중등부" }),
          child: [],
        },
        {
          name: "고등부",
          total: await getSeongdoCount({ group2: "고등부" }),
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
        eduName,
        page,
        group1,
        group2,
      },
      groupTree,
    }
  } else {
    return {
      searchParams: {
        name,
        jikbun,
        order,
        eduName,
        page,
        group1,
        group2,
      },
    }
  }
}
