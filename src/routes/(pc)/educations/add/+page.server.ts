import { redirect } from "@sveltejs/kit"

export const load = async ({ locals }) => {
  const { allowedGroup } = locals
  if (!allowedGroup.includes("교육") && !allowedGroup.includes("전체")) {
    throw redirect(302, encodeURI(`/educations/전체`))
  }
}
