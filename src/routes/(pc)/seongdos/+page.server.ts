import { getSeongdosSearchParams } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ request, fetch, url, locals }) => {
  const {
    name,
    jikbun,
    page,
    order,
    group1,
    group2,
    birthStart,
    birthEnd,
    showTeacher,
  } = locals.searchParams

  const deleteMany = url.searchParams.get("deleteMany") || false

  if (isNaN(page) || page < 0 || page == "") {
    const url = `/seongdos${getSeongdosSearchParams({
      name,
      jikbun,
      order,
      page: 1,
      group1,
      group2,
      birthStart,
      birthEnd,
    })}`

    throw redirect(302, encodeURI(url))
  }

  let requestUrl = `/api/seongdos${getSeongdosSearchParams({
    name,
    jikbun,
    order,
    page,
    group1,
    group2,
    birthStart,
    birthEnd,
    excludeETC: group1 == "기타" ? false : true,
    showTeacher,
  })}`

  const response = await fetch(requestUrl, {
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    const { seongdos, page: seongdoPage } = await response.json()
    if (seongdoPage?.totalPage == 0) {
    } else if (seongdoPage.totalPage < page) {
      const url = `/seongdos${getSeongdosSearchParams({
        name,
        jikbun,
        order,
        page: seongdoPage.totalPage,
        group1,
        group2,
        birthStart,
        birthEnd,
      })}`

      throw redirect(302, encodeURI(url))
    }

    let listName = ""
    if (!group1) {
      listName = "전체 성도"
    } else if (group1 == "장년부") {
      if (!group2) {
        listName = "장년부 성도"
      } else {
        listName = group2 + " 성도"
      }
    } else if (group1 == "청년부") {
      if (!group2) {
        listName = "청년부"
      } else {
        listName = group2
      }
      if (showTeacher) {
        listName = listName + " 교사"
      } else {
        listName = listName + " 성도"
      }
    } else if (group1 == "교회학교") {
      if (!group2) {
        listName = "교회학교"
      } else {
        listName = group2
      }
      if (showTeacher) {
        listName = listName + " 교사"
      } else {
        listName = listName + " 성도"
      }
    } else if (group1 == "교역자") {
      listName = "교역자"
    } else if (group1 == "기타") {
      if (!group2) {
        listName = "기타 성도"
      } else {
        listName = group2 + " 성도"
      }
    }

    return {
      seongdos,
      page: seongdoPage,
      deleteMany,
      listName,
    }
  }
}
