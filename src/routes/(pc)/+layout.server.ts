import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "../$types"
import { SelectList } from "$lib/models/SelectList"

export const load: LayoutServerLoad = async ({ url }) => {
  if (url.pathname == "/") {
    throw redirect(303, "/seongdos")
  }

  const selectList = await SelectList.findOne()

  return {
    path: url.pathname.split("/")[1],
    selectList: JSON.stringify(selectList),
  }
}
