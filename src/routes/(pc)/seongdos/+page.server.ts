import type { ISeongdoSearchBody } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { seongdoSearchBody } from "$lib/store"
import { getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ request, fetch, url, locals }) => {
  const { name, jikbun, order, group1, group2, birthStart, birthEnd } =
    locals.searchParams

  const requestUrl = `/api/seongdos${decodeURI(url.search)}`

  const response = await fetch(requestUrl, {
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    const { seongdos, page } = await response.json()

    if (page.totalPage < page) {
      const url = `/seongdos${getSeongdosSearchParams({
        name,
        jikbun,
        order,
        page: page.totalPage,
        group1,
        group2,
        birthStart,
        birthEnd,
      })}`

      throw redirect(302, url)
    }

    return {
      seongdos,
      page,
    }
  }
}
