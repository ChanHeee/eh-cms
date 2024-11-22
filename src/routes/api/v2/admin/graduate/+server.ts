import { IPage, ISeongdo } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { json, RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ request, url }) => {
  const name = url.searchParams.get("name")
  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1
  const take = 12

  let findQuery = {}
  let seongdos: ISeongdo[]
  let total: number

  if (name == "영아부") {
    findQuery = {
      // name: { $regex: "^temp" },
      group1: "교회학교",
      group2: "영아부",
      birth: { $regex: "^2021" },
    }
  } else if (name == "유치부") {
    findQuery = {
      // name: { $regex: "^temp" },
      group1: "교회학교",
      group2: "유치부",
      birth: { $regex: "^2018" },
    }
  } else if (name == "유년부") {
    findQuery = {
      // name: { $regex: "^temp" },
      group1: "교회학교",
      group2: "유년부",
      birth: { $regex: "^2015" },
    }
  } else if (name == "초등부") {
    findQuery = {
      // name: { $regex: "^temp" },
      group1: "교회학교",
      group2: "초등부",
      birth: { $regex: "^2012" },
    }
  } else if (name == "중등부") {
    findQuery = {
      // name: { $regex: "^temp" },
      group1: "교회학교",
      group2: "중등부",
      birth: { $regex: "^2009" },
    }
  } else if (name == "고등부") {
    findQuery = {
      // name: { $regex: "^temp" },
      group1: "교회학교",
      group2: "고등부",
      birth: { $regex: "^2006" },
    }
  } else if (name == "2청년부") {
    findQuery = {
      // name: { $regex: "^temp" },
      group1: "청년부",
      group2: "2청년",
      birth: { $regex: "^1999" },
    }
  }

  seongdos = await Seongdo.find(findQuery)
    .skip((page - 1) * take)
    .limit(take)
  total = await Seongdo.count(findQuery)

  return json({
    seongdos,
    page: {
      totalSize: total,
      totalPage: Math.ceil(total / take),
      requestPage: page,
      requestSize: seongdos.length,
      requestParams: {
        name,
      },
    },
  })
}

//*  @desc    Graduate 교회학교
//*  @route   GET /api/v2/admin/graduate
//*  @access  Private/Admin
export const POST: RequestHandler = async ({ request }) => {
  const graduateYears = [2021, 2018, 2015, 2012, 2009, 2006, 1999]
  const { name } = await request.json()

  if (name == "영아부") {
    await Seongdo.updateMany(
      {
        // name: { $regex: "^temp" },
        group1: "교회학교",
        group2: "영아부",
        birth: { $regex: "^2021" },
      },
      { group2: "유치부" }
    )
  } else if (name == "유치부") {
    await Seongdo.updateMany(
      {
        // name: { $regex: "^temp" },
        group1: "교회학교",
        group2: "유치부",
        birth: { $regex: "^2018" },
      },
      { group2: "유년부" }
    )
  } else if (name == "유년부") {
    await Seongdo.updateMany(
      {
        // name: { $regex: "^temp" },
        group1: "교회학교",
        group2: "유년부",
        birth: { $regex: "^2015" },
      },
      { group2: "초등부" }
    )
  } else if (name == "초등부") {
    await Seongdo.updateMany(
      {
        // name: { $regex: "^temp" },
        group1: "교회학교",
        group2: "초등부",
        birth: { $regex: "^2012" },
      },
      { group2: "중등부" }
    )
  } else if (name == "중등부") {
    await Seongdo.updateMany(
      {
        // name: { $regex: "^temp" },
        group1: "교회학교",
        group2: "중등부",
        birth: { $regex: "^2009" },
      },
      { group2: "고등부" }
    )
  } else if (name == "고등부") {
    await Seongdo.updateMany(
      {
        // name: { $regex: "^temp" },
        group1: "교회학교",
        group2: "고등부",
        birth: { $regex: "^2006" },
      },
      { group1: "청년부", group2: "2청년" }
    )
  } else if (name == "2청년부") {
    await Seongdo.updateMany(
      {
        // name: { $regex: "^temp" },
        group1: "청년부",
        group2: "2청년",
        birth: { $regex: "^1999" },
      },
      { group2: "1청년" }
    )
  }

  return json({ success: true })
}
