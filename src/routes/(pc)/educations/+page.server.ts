import type { ISeongdoSearchBody } from "$lib/interfaces"
import { seongdoSearchBody } from "$lib/store"
import { getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ request, fetch, url, locals }) => {
  // const proceedingEdu = await (
  //   await fetch(
  //     locals.className
  //       ? `/api/educations?status=proceeding&name=${locals.className}`
  //       : `/api/educations?status=proceeding`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //     }
  //   )
  // ).json()
  // const recentEdu = await (
  //   await fetch(
  //     locals.className
  //       ? `/api/educations?status=terminated&name=${locals.className}`
  //       : `/api/educations?status=terminated`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //     }
  //   )
  // ).json()
  // return {
  //   proceedingEdu,
  //   recentEdu,
  // }
}
