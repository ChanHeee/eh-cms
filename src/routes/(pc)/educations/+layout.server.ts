import type { IGroup } from "$lib/interfaces"
import { redirect } from "@sveltejs/kit"

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url, locals, fetch }) => {
  console.log("educations layout.server")
  const className = decodeURI(url.pathname).split("/")[2]
  const name = url.searchParams.get("name")
  const jikbun = JSON.parse(url.searchParams.get("jikbun"))
  const birthStart = url.searchParams.get("birthStart")
  const birthEnd = url.searchParams.get("birthEnd")
  const order = url.searchParams.get("order")
  const page = url.searchParams.get("page")

  locals.searchParams = {
    name,
    jikbun,
    order,
    page,
    birthStart,
    birthEnd,
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
    },
  }
}