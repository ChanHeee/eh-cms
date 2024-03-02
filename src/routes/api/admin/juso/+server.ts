import { JUSO_API_KEY } from "$lib/env"
import type { IEducation } from "$lib/interfaces"
import { Education } from "$lib/models/Education"
import { Seongdo } from "$lib/models/Seongdo"
import { json } from "@sveltejs/kit"

export const GET = async ({ request, url, fetch }) => {
  const keyword = url.searchParams.get("keyword")

  const response = await fetch(
    `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${JUSO_API_KEY}&keyword=${keyword}&resultType=json&currentPage=1&countPerPage=5`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  )
  const {
    results: {
      common: { totalCount },
      juso,
    },
  } = await response.json()

  return json({
    totalCount,
    roadAddrPart1: juso[0].roadAddrPart1,
    roadAddrPart2: juso[0].roadAddrPart2,
  })
}
