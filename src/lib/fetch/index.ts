import type { ISeongdoSearchBody } from "$lib/interfaces"
import { seongdoSearchBody } from "$lib/store"
import { json } from "@sveltejs/kit"

export const getSeongdos = async (data: ISeongdoSearchBody) => {
  const response = await fetch(`/api/seongdos/search`, {
    method: "POST",
    body: JSON.stringify({ ...data, take: 12 }),
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

export const getSeongdoCount = async (data: {
  group1: string
  group2?: string
}) => {
  const { group1, group2 } = data
  const response = await fetch("/api/seongdos/count", {
    method: "POST",
    body: JSON.stringify({
      group1,
      group2,
    }),
    headers: {
      "content-type": "application/json",
    },
  })

  const { count } = await response.json()
  return count
}
