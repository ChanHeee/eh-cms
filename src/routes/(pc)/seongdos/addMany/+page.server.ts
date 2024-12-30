import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ locals }) => {
  const { allowedGroup } = locals

  if (locals.allowedGroup.includes("게스트")) {
    throw redirect(303, "/seongdos")
  }

  const { group2 } = locals.searchParams
  return { group2 }
}
