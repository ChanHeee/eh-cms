import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, fetch, locals }) => {
  if (!locals.allowedGroup.includes("전체")) {
    throw redirect(303, "/seongdos")
  }
  const action = url.searchParams.get("action")
  const name = url.searchParams.get("name")
  const page =
    url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1

  if (action == "graduate" && name) {
    const response = await fetch(
      `/api/v2/admin/graduate?name=${name}&page=${page}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    )
    let seongdos, pageInfo
    if (response.ok) {
      const jsonResult = await response.json()
      seongdos = jsonResult.seongdos
      pageInfo = jsonResult.page
    }

    return { action, seongdos, page: pageInfo }
  } else {
    return { action }
  }
}
