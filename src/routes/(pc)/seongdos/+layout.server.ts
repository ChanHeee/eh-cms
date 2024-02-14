import { JWT_SECRET } from "$lib/env"
import type { IGroup } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
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
    birthStart,
    birthEnd,
  }

  let groupTree: IGroup | null = null

  if (group1 == "장년부") {
    groupTree = {
      name: "장년부",
      count: await Seongdo.count({ group1: "장년부" }),
      child: [
        {
          name: "1교구",
          count: await Seongdo.count({
            group1: "장년부",
            group2: { $regex: "1교구" },
          }),
          child: await Promise.all(
            ("" + Array(19)).split(",").map(async (item, idx) => {
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
          count: await Seongdo.count({
            group1: "장년부",
            group2: { $regex: "2교구" },
          }),
          child: await Promise.all(
            ("" + Array(20)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: await Seongdo.count({
                  group1: "장년부",
                  group2: `2교구,${idx + 1}구역`,
                }),
                child: [],
              }
            })
          ),
        },
        {
          name: "3교구",
          count: await Seongdo.count({
            group1: "장년부",
            group2: { $regex: "3교구" },
          }),
          child: await Promise.all(
            ("" + Array(18)).split(",").map(async (item, idx) => {
              return {
                name: `${idx + 1}구역`,
                count: await Seongdo.count({
                  group1: "장년부",
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
      count: await Seongdo.count().where({
        $or: [{ group1: "청년부" }, { "services.group1": "청년부" }],
      }),
      child: [
        {
          name: "1청년",
          count: await Seongdo.count().where({
            $or: [
              { group1: "청년부", group2: "1청년" },
              { "services.group1": "청년부", "services.group2": "1청년" },
            ],
          }),
          child: [],
        },
        {
          name: "2청년",
          count: await Seongdo.count().where({
            $or: [
              { group1: "청년부", group2: "2청년" },
              { "services.group1": "청년부", "services.group2": "2청년" },
            ],
          }),
          child: [],
        },
      ],
    }
  } else if (group1 == "교회학교") {
    groupTree = {
      name: "교회학교",
      count: await Seongdo.count().where({
        $or: [{ group1: "교회학교" }, { "services.group1": "교회학교" }],
      }),
      child: [
        {
          name: "영아부",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "영아부" },
              { "services.group1": "교회학교", "services.group2": "영아부" },
            ],
          }),
          child: [],
        },
        {
          name: "유치부",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "유치부" },
              { "services.group1": "교회학교", "services.group2": "유치부" },
            ],
          }),
          child: [],
        },
        {
          name: "유년부",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "유년부" },
              { "services.group1": "교회학교", "services.group2": "유년부" },
            ],
          }),
          child: [],
        },
        {
          name: "초등부",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "초등부" },
              { "services.group1": "교회학교", "services.group2": "초등부" },
            ],
          }),
          child: [],
        },
        {
          name: "중등부",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "중등부" },
              { "services.group1": "교회학교", "services.group2": "중등부" },
            ],
          }),
          child: [],
        },
        {
          name: "고등부",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "고등부" },
              { "services.group1": "교회학교", "services.group2": "고등부" },
            ],
          }),
          child: [],
        },
        {
          name: "은혜브릿지",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "은혜브릿지" },
              {
                "services.group1": "교회학교",
                "services.group2": "은혜브릿지",
              },
            ],
          }),
          child: [],
        },
        {
          name: "늘푸른부",
          count: await Seongdo.count().where({
            $or: [
              { group1: "교회학교", group2: "늘푸른부" },
              { "services.group1": "교회학교", "services.group2": "늘푸른부" },
            ],
          }),
          child: [],
        },
      ],
    }
  } else if (group1 == "교역자") {
    groupTree = {
      name: "교역자",
      count: await Seongdo.count({ group1: "교역자" }),
      child: [
        {
          name: "담임목사",
          count: await Seongdo.count({ group1: "교역자", group2: "담임목사" }),
          child: [],
        },
        {
          name: "목사",
          count: await Seongdo.count({ group1: "교역자", group2: "목사" }),
          child: [],
        },
        {
          name: "강도사",
          count: await Seongdo.count({ group1: "교역자", group2: "강도사" }),
          child: [],
        },
        {
          name: "전도사",
          count: await Seongdo.count({ group1: "교역자", group2: "전도사" }),
          child: [],
        },
        {
          name: "교육전도사",
          count: await Seongdo.count({
            group1: "교역자",
            group2: "교육전도사",
          }),
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
          { group1, group2: { $in: ["별명부", "재적"] } },
        ],
      }),
      child: [
        {
          name: "별명부",
          count: await Seongdo.count({ group1: "기타", group2: "별명부" }),
          child: [],
        },
        {
          name: "재적",
          count: await Seongdo.count({ group1: "기타", group2: "재적" }),
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
