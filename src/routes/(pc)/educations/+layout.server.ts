import type { IGroup } from "$lib/interfaces"
import { getGroupList } from "$lib/utils"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
  const className = decodeURI(url.pathname).split("/")[2]
  const name = url.searchParams.get("name")
  const jikbun = JSON.parse(url.searchParams.get("jikbun"))
  const birthStart = url.searchParams.get("birthStart")
  const birthEnd = url.searchParams.get("birthEnd")
  const group1 = url.searchParams.get("group1")
  const group2 = url.searchParams.get("group2")
  const order = url.searchParams.get("order")
  const page =
    url.searchParams.get("page") == ""
      ? 1
      : url.searchParams.get("page") != null
      ? parseInt(url.searchParams.get("page"))
      : 1

  const { allowedGroup } = locals

  locals.searchParams = {
    name,
    jikbun,
    order,
    page,
    birthStart,
    birthEnd,
    group1,
    group2,
  }

  return {
    searchParams: {
      name,
      jikbun,
      order,
      page,
      className,
      birthStart,
      birthEnd,
      group1,
      group2,
    },
    groupList: getGroupList(allowedGroup),
  }
}
