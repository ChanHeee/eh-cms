import type { ISeongdoSearchParams } from "$lib/interfaces"

export const getSeongdosSearchParams = ({
  name,
  jikbun,
  order,
  eduName,
  page,
  group1,
  group2,
}: ISeongdoSearchParams) => {
  let searchParams = []
  if (name) searchParams.push(`name=${name}`)
  if (jikbun && jikbun.length > 0)
    searchParams.push(`jikbun=${JSON.stringify(jikbun)}`)
  if (order) searchParams.push(`order=${order}`)
  if (eduName) searchParams.push(`eduName=${eduName}`)
  if (group1) {
    searchParams.push(`group1=${group1}`)
    if (group2) {
      searchParams.push(`group2=${group2}`)
    }
  }

  if (page) searchParams.push(`page=${page}`)

  return searchParams.length > 0 ? "?" + searchParams.join("&") : ""
}

export const isValidToken = (input: string) => {}

export const getAgeFromBirth = (birth: string) => {
  var birthday = new Date(birth + "T00:00:00.000Z")

  var now = new Date()
  var dd = String(now.getDate()).padStart(2, "0")
  var mm = String(now.getMonth() + 1).padStart(2, "0")
  var yyyy = now.getFullYear()
  var nowYMD = yyyy + "-" + mm + "-" + dd + "T00:00:00.000Z"
  var today = new Date(nowYMD)

  var age = today.getFullYear() - birthday.getFullYear()
  birthday.setFullYear(today.getFullYear())

  if (today < birthday) {
    age--
  }
  return age
}

export const getGroupItem = (
  group1: string,
  group2: string
): { group1: string; group2: string; group2Add?: string } => {
  if (!group2) {
    return { group1, group2: "" }
  } else if (group1 == "장년부") {
    const first = group2.split(",")[0]
    const second = group2.split(",")[1]
    if (second) {
      return { group1, group2: first, group2Add: second }
    } else {
      return { group1, group2: first }
    }
  }
  return { group1, group2 }
}

export const getGroupString = (group1: any, group2: any) => {
  if (!group2) {
    if (!group1) {
      return "미분류"
    } else {
      return group1 + " > 미분류"
    }
  } else {
    if (group1 == "장년부") {
      const first = group2.split(",")[0]
      const second = group2.split(",")[1]
      if (second) {
        return group1 + " > " + first + " > " + second
      } else {
        return group1 + " > " + group2 + " > 미분류"
      }
    } else {
      return group1 + " > " + group2
    }
  }
}

export const getSearchParams = (params: {}) => {
  const paramList = Object.entries(params)

  let searchParams: string[] = []
  paramList.forEach((item) => {
    {
      if (!isNullable(item[1])) {
        if (typeof item[1] == "object") {
          searchParams.push(`${item[0]}=${JSON.stringify(item[1])}`)
        } else {
          searchParams.push(`${item[0]}=${item[1]}`)
        }
      }
    }
  })
  return searchParams.length > 0 ? "?" + searchParams.join("&") : ""
}

export const getEduSlug = (
  name: string,
  semester: string,
  startDate: string
) => {
  return `${name}-${semester}-${startDate}`
}

export const isNullable = (input: any) => {
  if (!input) {
    return true
  }
  if (typeof input == "object" && input.length == 0) {
    return true
  }
  return false
}

export const isAllowGroup = (
  allowedGroup: string[],
  group1: string,
  group2: string
) => {
  let isAllow = false
  const seongdoGroupItem = getGroupItem(group1, group2)
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
    if (!group1) {
      isAllow = true
    } else if (!group2 && group1 == groupItemFromAllowed.group1) {
      isAllow = true
    }
  })

  if (allowedGroup.includes("전체")) {
    isAllow = true
  }

  return isAllow
}

export const isAllowDeleteGroup = (
  allowedGroup: string[],
  group1: string,
  group2: string
) => {
  let isAllow = false
  if (allowedGroup.includes("전체")) {
    isAllow = true
  }

  const urlGroupItem = getGroupItem(group1, group2)
  allowedGroup.map((item) => {
    const groupItemFromAllowed = getGroupItem(
      item.split("_")[0],
      item.split("_")[1]
    )

    if (!urlGroupItem.group2) {
      if (
        !groupItemFromAllowed.group2 &&
        urlGroupItem.group1 == groupItemFromAllowed.group1
      ) {
        isAllow = true
      }
    } else {
      if (
        !groupItemFromAllowed.group2 &&
        groupItemFromAllowed.group1 == urlGroupItem.group1
      ) {
        isAllow = true
      } else if (
        groupItemFromAllowed.group1 == urlGroupItem.group1 &&
        groupItemFromAllowed.group2 == urlGroupItem.group2
      ) {
        isAllow = true
      }
    }
  })
  return isAllow
}

export const textShortenWithEllipsis = (text: string, maxLen: number) => {
  if (text.length > maxLen) {
    return text.substring(0, maxLen) + "..."
  } else {
    return text
  }
}

export const getGroupList = (allowedGroup: string[]) => {
  let groupList = {}
  allowedGroup.map((item) => {
    groupList[item.split("_")[0]] = []
  })
  allowedGroup.map((item) => {
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
      groupList[item.split("_")[0]].push(child)
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
  return groupList
}
