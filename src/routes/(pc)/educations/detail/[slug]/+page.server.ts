import type { PageServerLoad } from "../../$types"

export const load: PageServerLoad = async ({ url, fetch }) => {
  const slugArray = decodeURI(url.pathname).split("/")[3].split("-")

  const name = slugArray[0]
  const semester = slugArray[1]
  const startDate = `${slugArray[2]}-${slugArray[3]}-${slugArray[4]}`

  let response = await fetch(
    `/api/educations?name=${name}&semester=${semester}&startDate=${startDate}`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )
  let educations
  if (response.ok) {
    educations = (await response.json()).educations
  }

  response = await fetch(
    `/api/seongdoEdus?educationId=${educations[0]._id}&take=${8}`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )
  let seongdoEdus, page
  if (response.ok) {
    const result = await response.json()
    seongdoEdus = result.seongdoEdus
    page = result.page
  }

  return {
    education: educations[0],
    seongdoEdus,
    page,
  }
}
