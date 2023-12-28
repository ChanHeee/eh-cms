import { loadFlash, redirect } from "sveltekit-flash-message/server"
import { JWT_SECRET } from "$lib/env"
import { getGroupItem } from "$lib/utils"
import jwt from "jsonwebtoken"
/** @type {import('@sveltejs/kit').Load} */

export const load = loadFlash(async ({ url, fetch, locals, cookies }) => {
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
