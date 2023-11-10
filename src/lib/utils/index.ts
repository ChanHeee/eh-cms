import type { ISeongdoSearchParams } from "$lib/interfaces"

export const getSeongdosSearchParams = ({
  name,
  jikbun,
  order,
  eduName,
  page,
  group1,
  group2,
}: ISeongdoSearchParams) => {
  let searchParams = []
  if (name) searchParams.push(`name=${name}`)
  if (jikbun && jikbun.length > 0)
    searchParams.push(`jikbun=${JSON.stringify(jikbun)}`)
  if (order) searchParams.push(`order=${order}`)
  if (eduName) searchParams.push(`eduName=${eduName}`)
  if (group1) {
    searchParams.push(`group1=${group1}`)
    if (group2) {
      searchParams.push(`group2=${group2}`)
    }
  }

  if (page) searchParams.push(`page=${page}`)

  return searchParams.length > 0 ? "?" + searchParams.join("&") : ""
}

export const isValidToken = (input: string) => {}

export const getAgeFromBirth = (birth: string) => {
  var birthday = new Date(birth + "T00:00:00.000Z")

  var now = new Date()
  var dd = String(now.getDate()).padStart(2, "0")
  var mm = String(now.getMonth() + 1).padStart(2, "0")
  var yyyy = now.getFullYear()
  var nowYMD = yyyy + "-" + mm + "-" + dd + "T00:00:00.000Z"
  var today = new Date(nowYMD)

  var age = today.getFullYear() - birthday.getFullYear()
  birthday.setFullYear(today.getFullYear())

  if (today < birthday) {
    age--
  }
  return age
}
