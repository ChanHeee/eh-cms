import type { ISeongdoSearchBody } from "$lib/interfaces"
import { Seongdo } from "$lib/models/Seongdo"
import { seongdoSearchBody } from "$lib/store"
import { getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ request, fetch, url, locals }) => {
  const { name, jikbun, order, eduName, page, group1, group2 } =
    locals.searchParams

  const requestUrl = `/api/seongdos${decodeURI(url.search)}`

  const response = await fetch(requestUrl, {
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    const { seongdos, total, take, skip } = await response.json()
    const last = Math.ceil(total / 12)

    if (last < page) {
      const url = `/seongdos${getSeongdosSearchParams({
        name,
        jikbun,
        order,
        eduName,
        page: last,
        group1,
        group2,
      })}`

      throw redirect(302, url)
    }

    return {
      seongdos,
      total,
      take,
      skip,
    }
  }
}
