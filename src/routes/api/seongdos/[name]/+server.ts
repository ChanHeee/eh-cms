import { JWT_SECRET } from "$lib/env"
import { Seongdo } from "$lib/models/Seongdo"
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

  const name = decodeURI(url.pathname).split("/")[3]
  const birth = url.searchParams.get("birth")

  const seongdo = await Seongdo.findOne({ name, birth })
  const senogdoValue = {
    _id: seongdo?._id,
    name: seongdo?.name,
    avatar: seongdo?.avatar,
    birth: seongdo?.birth,
    gender: seongdo?.gender,
    phone: seongdo?.phone,
    age: seongdo?.age,
    jikbun: seongdo?.jikbun,
    singeup: seongdo?.singeup,
    singeupDate: seongdo?.singeupDate,
    group1: seongdo?.group1,
    group2: seongdo?.group2,
    address: seongdo?.address,
    addressHistory: seongdo?.addressHistory,
    remarks: seongdo?.remarks,
    enrolled_at: seongdo?.enrolled_at,
    services: seongdo?.services,
  }
  let { services, ...rest } = senogdoValue

  services = seongdo?.services.sort((a, b) =>
    b.endYear - a.endYear > 0 ? -1 : b.endYear - a.endYear == 0 ? -1 : 1
  )
  services = seongdo?.services.sort((a, b) => {
    const aEndYear = a.endYear == null ? 10000000 : a.endYear
    const bEndYear = b.endYear == null ? 10000000 : b.endYear

    const aValue = a.startYear * 1000 + aEndYear
    const bValue = b.startYear * 1000 + bEndYear
    if (bValue - aValue >= 0) {
      return 1
    } else {
      return -1
    }
  })

  return json({
    seongdo:
      Object.values({ services, ...rest }).filter((i) => i != undefined)
        .length == 0
        ? null
        : { services, ...rest },
  })
}
