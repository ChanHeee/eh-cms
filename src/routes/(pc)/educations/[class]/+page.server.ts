import { getSearchParams, getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

export const load = async ({ request, fetch, url, locals }) => {
  const { name, jikbun, order, page, birthStart, birthEnd, group1, group2 } =
    locals.searchParams
  const className = decodeURI(url.pathname).split("/")[2]

  if (!["기초반", "성숙반", "사명자반", "전체"].includes(className)) {
    throw redirect(302, encodeURI(`/educations`))
  }

  if (isNaN(page) || page < 0 || page == "") {
    const url = `/educations/${className ?? "전체"}${getSearchParams({
      name,
      jikbun,
      order,
      page: 1,
      birthStart,
      birthEnd,
      group1,
      group2,
    })}`

    throw redirect(302, encodeURI(url))
  }

  let response = await fetch(
    `/api/seongdoEdus${getSearchParams({
      class: className,
      name,
      jikbun,
      order,
      page,
      birthStart,
      birthEnd,
      group1,
      group2,
    })}`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )

  const { seongdoEdus, page: seongdoEduPage } = await response.json()

  if (seongdoEduPage.totalPage == 0) {
  } else if (seongdoEduPage.totalPage < page) {
    const url = `/educations/${className ?? "전체"}${getSearchParams({
      name,
      jikbun,
      order,
      page: seongdoEduPage.totalPage,
      birthStart,
      birthEnd,
      group1,
      group2,
    })}`

    throw redirect(302, encodeURI(url))
  }

  return {
    seongdoEdus,
    page: seongdoEduPage,
  }
}
