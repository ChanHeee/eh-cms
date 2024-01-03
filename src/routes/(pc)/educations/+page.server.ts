import { getSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ request, fetch, url, locals }) => {
  const { page, order } = locals.searchParams
  const { allowedGroup } = locals

  if (!allowedGroup.includes("교육") && !allowedGroup.includes("전체")) {
    throw redirect(302, encodeURI(`/educations/전체`))
  }

  if (isNaN(page) || page < 0 || page == "") {
    const url = `/educations${getSearchParams({
      order,
      page: 1,
    })}`

    throw redirect(302, encodeURI(url))
  }

  const response = await fetch(`/api/educations${decodeURI(url.search)}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    const { educations, page: eduPage } = await response.json()

    if (eduPage.totalPage == 0) {
    } else if (eduPage.totalPage < page) {
      const url = `/educations${getSearchParams({
        order,
        page: eduPage.totalPage,
      })}`

      throw redirect(302, encodeURI(url))
    }

    await Promise.all(
      educations.map(async (edu) => {
        const response = await fetch(
          `/api/seongdoEdus/count?educationId=${edu._id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
          }
        )
        if (response.ok) {
          const result = await response.json()
          edu.enrolledNum = result.count
        }
      })
    )

    return { educations, page: eduPage }
  }
}
