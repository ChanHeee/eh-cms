import { loadFlash, redirect } from "sveltekit-flash-message/server"
import { JWT_SECRET } from "$lib/env"
import { getGroupItem } from "$lib/utils"
import jwt from "jsonwebtoken"
/** @type {import('@sveltejs/kit').Load} */

export const load = loadFlash(async ({ url, fetch, locals, cookies }) => {
  console.log("seongdos/[name] page.server.ts")
  const { allowedGroup } = locals

  const name = decodeURIComponent(url.pathname.split("/")[2])

  let seongdo, family, simbangs
  let response = await fetch(`/api/seongdos/${name}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    seongdo = (await response.json()).seongdo
  }

  if (allowedGroup) {
    let isAllow = false
    const seongdoGroupItem = getGroupItem(seongdo.group1, seongdo.group2)
    allowedGroup.map((item) => {
      const groupItemFromAllowed = getGroupItem(
        item.split("_")[0],
        item.split("_")[1]
      )

      if (!groupItemFromAllowed.group2) {
        if (groupItemFromAllowed.group1 == seongdoGroupItem.group1) {
          isAllow = true
        }
      } else {
        if (
          groupItemFromAllowed.group1 == seongdoGroupItem.group1 &&
          groupItemFromAllowed.group2 == seongdoGroupItem.group2
        ) {
          isAllow = true
        }
      }
      if (!seongdoGroupItem.group1) {
        isAllow = true
      }
    })

    if (!isAllow) {
      throw redirect(
        303,
        "/seongdos",
        {
          type: "error",
          message: "접근 권한이 없습니다.",
        },
        cookies
      )
    }
  }

  response = await fetch(`/api/families?seongdoId=${seongdo._id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    family = (await response.json()).family
  }

  response = await fetch(`/api/simbangs?seongdoId=${seongdo._id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    simbangs = (await response.json()).simbangs
  }

  return {
    seongdo,
    family,
    simbangs,
  }
})
