import { getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ request, fetch, url, locals }) => {
  const response = await fetch("/api/educations", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  const { educations, page } = await response.json()
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

  return { educations, page }
}
