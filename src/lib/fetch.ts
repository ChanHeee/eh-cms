import { json } from "@sveltejs/kit"
import type { ISeongdo, ISeongdoSearchBody } from "./interface"
import { seongdoSearchBody } from "./store"

export const getAllSeongdos = async () => {
  const response = await fetch(`/api/seongdos/searchAll`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    const { seongdos } = await response.json()
    return json({ seongdos })
  } else {
    return json({ success: false, message: "fail to fetch" })
  }
}

export const getSeongdos = async (data: ISeongdoSearchBody) => {
  const response = await fetch(`/api/seongdos/search`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    seongdoSearchBody.set(data)
    const { seongdos, total, take, skip } = await response.json()
    return json({ seongdos, total, take, skip })
  } else {
    return json({ success: false, message: "fail to fetch" })
  }
}

export const getSeongdosNotInEdu = async (data: ISeongdoSearchBody) => {
  const response = await fetch(`/api/seongdos/searchNotIn`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })

  if (response.ok) {
    seongdoSearchBody.set(data)
    const { seongdos, total, take, skip } = await response.json()
    return json({ seongdos, total, take, skip })
  } else {
    return json({ success: false, message: "fail to fetch" })
  }
}

export const addNewSeongdo = async (data: ISeongdo) => {
  const response = await fetch("/api/seongdos/create", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })
  if (response.ok) {
    return json({ success: true })
  } else {
    return json({ success: false })
  }
}
