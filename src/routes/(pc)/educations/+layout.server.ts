import type { IGroup } from "$lib/interfaces"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
  // console.log("educations layout.server")
  const className = url.searchParams.get("class")

  // return {
  //   className,
  // }

  const proceedingEdu = await (
    await fetch(
      className
        ? `/api/educations?status=proceeding&name=${className}`
        : `/api/educations?status=proceeding`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    )
  ).json()

  const recentEdu = await (
    await fetch(
      className
        ? `/api/educations?status=terminated&name=${className}`
        : `/api/educations?status=terminated`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    )
  ).json()

  return {
    proceedingEdu,
    recentEdu,
  }
}
