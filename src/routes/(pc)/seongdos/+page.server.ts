import { getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ request, fetch, url, locals }) => {
  const { name, jikbun, page, order, group1, group2, birthStart, birthEnd } =
    locals.searchParams

  const deleteMany = url.searchParams.get("deleteMany") || false

  if (isNaN(page) || page < 0 || page == "") {
    const url = `/seongdos${getSeongdosSearchParams({
      name,
      jikbun,
      order,
      page: 1,
      group1,
      group2,
      birthStart,
      birthEnd,
    })}`

    throw redirect(302, encodeURI(url))
  }

  const requestUrl = `/api/seongdos${decodeURI(url.search)}`

  const response = await fetch(requestUrl, {
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    const { seongdos, page: seongdoPage } = await response.json()
    if (seongdoPage.totalPage == 0) {
    } else if (seongdoPage.totalPage < page) {
      const url = `/seongdos${getSeongdosSearchParams({
        name,
        jikbun,
        order,
        page: seongdoPage.totalPage,
        group1,
        group2,
        birthStart,
        birthEnd,
      })}`

      throw redirect(302, encodeURI(url))
    }

    return {
      seongdos,
      page: seongdoPage,
      deleteMany,
    }
  }
}
