import type { PageServerLoad } from "../$types"

export const load: PageServerLoad = async ({ url, fetch }) => {
  const slugArray = decodeURI(url.pathname).split("/")[2].split("-")
  const name = slugArray[0]
  const semester = slugArray[1]
  const startDate = `${slugArray[2]}-${slugArray[3]}-${slugArray[4]}`

  const educations = (
    await (
      await fetch(
        `/api/educations?name=${name}&semester=${semester}&startDate=${startDate}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        }
      )
    ).json()
  ).educations

  return {
    education: educations[0],
  }
}
