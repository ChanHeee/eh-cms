import { getGroupList } from "$lib/utils"

export const load = async ({ locals }) => {
  const { allowedGroup } = locals

  // let groupList = {}
  // allowedGroup.map((item) => {
  //   groupList[item.split("_")[0]] = []
  // })
  // allowedGroup.map((item) => {
  //   const child = item.split("_")[1]
  //   if (!child) {
  //     if (item.split("_")[0] == "장년부") {
  //       groupList[item.split("_")[0]] = ["1교구", "2교구", "3교구"]
  //     } else if (item.split("_")[0] == "청년부") {
  //       groupList[item.split("_")[0]] = ["1청년", "2청년"]
  //     } else if (item.split("_")[0] == "교회학교") {
  //       groupList[item.split("_")[0]] = [
  //         "영아부",
  //         "유치부",
  //         "유년부",
  //         "초등부",
  //         "중등부",
  //         "고등부",
  //         "은혜브릿지",
  //         "늘푸른푸",
  //       ]
  //     }
  //   } else {
  //     console.log("in else", child)

  //     groupList[item.split("_")[0]].push(child)
  //     console.log(groupList)
  //   }
  // })
  // if (allowedGroup.includes("전체")) {
  //   groupList = {
  //     장년부: ["1교구", "2교구", "3교구"],
  //     청년부: ["1청년", "2청년"],
  //     교회학교: [
  //       "영아부",
  //       "유치부",
  //       "유년부",
  //       "초등부",
  //       "중등부",
  //       "고등부",
  //       "은혜브릿지",
  //       "늘푸른푸",
  //     ],
  //   }
  // }

  return { groupList: getGroupList(allowedGroup) }
}
