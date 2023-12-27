import { getSearchParams, getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types"

export const load = async ({ request, fetch, url, locals }) => {
  const { name, jikbun, order, page, birthStart, birthEnd } =
    locals.searchParams

  const className = decodeURI(url.pathname).split("/")[2]
  console.log("educations class server", className)

  let response = await fetch(
    `/api/seongdoEdus${getSearchParams({
      class: className,
      name,
      jikbun,
      order,
      page,
      birthStart,
      birthEnd,
    })}`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )

  const { seongdoEdus, page: seongdoEduPage } = await response.json()

  if (seongdoEduPage.totalPage < page) {
    const url = `/educations/${className ?? "전체"}${getSearchParams({
      name,
      jikbun,
      order,
      page: seongdoEduPage.totalPage,
      birthStart,
      birthEnd,
    })}`
    throw redirect(302, encodeURI(url))
  }

  return {
    seongdoEdus,
    page: seongdoEduPage,
  }
}
