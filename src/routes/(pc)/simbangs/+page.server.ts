import { redirect } from "@sveltejs/kit"

export const load = async ({ request, fetch, url, locals }) => {
  if (
    !locals.allowedGroup.includes("전체") ||
    !locals.allowedGroup.includes("심방")
  ) {
    throw redirect(303, "/seongdos")
  }

  let requestUrl = `/api/simbangs${decodeURI(url.search)}`
  const selectMany = url.searchParams.get("selectMany") || false

  const response = await fetch(requestUrl, {
    headers: {
      "content-type": "application/json",
    },
  })

  const { simbangs, page } = await response.json()

  return { simbangs, page, selectMany }
}
