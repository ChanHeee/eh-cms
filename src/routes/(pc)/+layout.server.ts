import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "../$types"
import { SelectList } from "$lib/models/SelectList"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "$lib/env"

export const load: LayoutServerLoad = async ({ url, locals }) => {
  if (url.pathname == "/") {
    throw redirect(303, "/seongdos")
  }

  const { allowedGroup } = jwt.verify(locals.token, JWT_SECRET)
  locals.allowedGroup = allowedGroup
  const selectList = await SelectList.findOne()

  return {
    path: url.pathname.split("/")[1],
    selectList: JSON.stringify(selectList),
    allowedGroup,
  }
}
