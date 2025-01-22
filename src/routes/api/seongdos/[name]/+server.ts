import { JWT_SECRET } from "$lib/env"
import { ISeongdo } from "$lib/interfaces"
import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { getAgeFromBirth } from "$lib/utils"
import { json, type RequestHandler } from "@sveltejs/kit"
import jwt from "jsonwebtoken"

const verifyBearerToken = (token) => {
  let tokenString = token?.split("Bearer ")[1]
  console.log(tokenString, "here")

  if (!tokenString) {
    return false
  }
  jwt.verify(tokenString, JWT_SECRET, (err, decoded) => {
    if (err) {
      return false
    }
  })
  return true
}

export const GET: RequestHandler = async ({ request, url, locals }) => {
  // if (!verifyBearerToken(request.headers.get("authorization"))) {
  //   return json({ success: false, message: "token is invalid" })
  // }

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
