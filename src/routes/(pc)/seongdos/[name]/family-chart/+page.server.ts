import { getFamilyChartFromDb, isAllowGroup } from "$lib/utils"
import { redirect } from "@sveltejs/kit"
import { loadFlash } from "sveltekit-flash-message/server"
/** @type {import('@sveltejs/kit').Load} */

export const load = loadFlash(async ({ url, fetch, locals, cookies }) => {
  const value = decodeURIComponent(url.pathname.split("/")[2])
  const name = value.split("-")[0]
  const birth = value.split("-").splice(1).join("-")

  let seongdo, charts
  let response = await fetch(`/api/seongdos/${name}?birth=${birth}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })

  const { allowedGroup } = locals
  let groupList: any = {}
  allowedGroup?.map((item) => {
    const child = item.split("_")[1]
    if (!child) {
      if (item.split("_")[0] == "장년부") {
        groupList[item.split("_")[0]] = ["1교구", "2교구", "3교구"]
      } else if (item.split("_")[0] == "청년부") {
        groupList[item.split("_")[0]] = ["1청년", "2청년"]
      } else if (item.split("_")[0] == "교회학교") {
        groupList[item.split("_")[0]] = [
          "영아부",
          "유치부",
          "유년부",
          "초등부",
          "중등부",
          "고등부",
          "은혜브릿지",
          "늘푸른푸",
        ]
      }
    } else {
      if (groupList[item.split("_")[0]]) {
        groupList[item.split("_")[0]] = [
          ...groupList[item.split("_")[0]],
          child,
        ]
      } else {
        groupList[item.split("_")[0]] = [child]
      }
    }
  })
  if (allowedGroup.includes("전체")) {
    groupList = {
      장년부: ["1교구", "2교구", "3교구"],
      청년부: ["1청년", "2청년"],
      교회학교: [
        "영아부",
        "유치부",
        "유년부",
        "초등부",
        "중등부",
        "고등부",
        "은혜브릿지",
        "늘푸른푸",
      ],
    }
  }

  if (response.ok) {
    seongdo = (await response.json()).seongdo
  }

  if (!seongdo) {
    throw redirect(303, "/seongdos")
  }

  if (!isAllowGroup(allowedGroup, seongdo.group1, seongdo.group2)) {
    throw redirect(303, "/seongdos")
  }

  response = await fetch(
    `/api/v2/familyCharts/getChartsWithSeongdoId?id=${seongdo._id}&avatar=true`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  )

  if (response.ok) {
    const result = await response.json()

    charts = getFamilyChartFromDb(result.charts)
  }

  return {
    seongdo,
    charts,
  }
})
