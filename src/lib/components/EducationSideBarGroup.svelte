<script lang="ts">
  import type { IGroup, ISeongdoEduSearchParams } from "$lib/interfaces"
  import { goto } from "$app/navigation"
  import { getGroupItem, getSearchParams } from "$lib/utils"
  import { UserFilled } from "carbon-icons-svelte"
  import { ChevronDown, ChevronUp, Renew, Search } from "carbon-icons-svelte"
  import DotFill from "$lib/icon/DotFill.svelte"
  import DotBorder from "$lib/icon/DotBorder.svelte"

  export let searchParams: ISeongdoEduSearchParams
  export let groupList: string[]
  export let groupTree: IGroup

  $: name = searchParams.name
  $: jikbunArray = searchParams.jikbun ?? []
  $: className = searchParams.className ?? "전체"
  $: semester = searchParams.semester
  $: birthStart = searchParams.birthStart
  $: birthEnd = searchParams.birthEnd
  $: groupItem = getGroupItem(searchParams.group1, searchParams.group2)
  $: group1 = groupItem.group1
  $: group2 = groupItem.group2
  $: group2Add = groupItem.group2Add ?? ""

  const searchHandler = () => {
    const params = getSearchParams({
      page: 1,
      name,
      jikbun: jikbunArray,
      group1,
      group2: group2Add ? group2 + "," + group2Add : group2,
      birthStart,
      birthEnd,
      semester,
    })

    if (!["기초반", "성숙반", "사명자반", "전체", ""].includes(className)) {
      className = "전체"
    }

    const url = `/educations/${className}${params}`

    goto(url)
  }
</script>

<aside
  class="hidden-if-modile flex flex-col w-[30rem] px-6 py-8 font-semilight text-gray-600 text-sm gap-4"
>
  <!-- 이름 검색 -->
  <div class="flex gap-2">
    <div class="flex flex-none items-center mx-auto">
      <button
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click={() => {
          goto("/educations/전체")
        }}
      >
        <Renew size={20} class="text-gray-600" />
      </button>
    </div>
    <div class="flex flex-auto items-center mx-auto">
      <input
        id="name"
        type="text"
        value={name}
        on:focus={() => {
          name = ""
        }}
        on:input={(e) => {
          name = e.target.value
        }}
        class="w-full bg-gray-50 border-y border-l border-gray-300 text-gray-900 text-sm focus:outline-0 p-2"
        placeholder="이름"
      />
      <button
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click|preventDefault={searchHandler}
        ><Search size={20} class="text-gray-600" />
      </button>
    </div>
  </div>

  <!-- 직분 검색 -->
  <div class="flex flex-col w-full justify-center items-center">
    <div class="flex w-full items-center mx-auto">
      <div
        class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
      >
        <div class="flex flex-col w-full">
          <input
            type="checkbox"
            id="dropdown"
            class="jikbun-input hidden"
            on:change={(e) => {
              if (e.target.checked) {
                document
                  .getElementById("jikbun-dropdown")
                  ?.classList.remove("hidden")

                document.getElementById("jikbun-down")?.classList.add("hidden")
                document.getElementById("jikbun-up")?.classList.remove("hidden")
              } else {
                const checkboxes = document.querySelectorAll(
                  "#jikbun-dropdown input",
                )
                document
                  .getElementById("jikbun-dropdown")
                  ?.classList.add("hidden")
                document
                  .getElementById("jikbun-down")
                  ?.classList.remove("hidden")
                document.getElementById("jikbun-up")?.classList.add("hidden")
                checkboxes.forEach((checkbox) => {
                  checkbox.checked = false
                })
              }
            }}
          />
          <label class="flex w-full justify-between p-2" for="dropdown">
            <p class="text-gray-400 text-sm select-none">직분</p>
            <ChevronDown id="jikbun-down" class="cursor-pointer" />
            <ChevronUp id="jikbun-up" class="hidden cursor-pointer" />
          </label>

          <div
            id="jikbun-dropdown"
            class="hidden grid grid-cols-2 gap-[5px] border-t border-gray-300 focus:outline-0 px-3 py-2"
          >
            <!-- 장로 checkbox -->
            <button
              class="relative flex items-center text-gray-600 text-sm gap-2 px-3"
              on:mouseover={() => {
                document
                  .querySelector("#jangro-tooltip")
                  ?.classList.remove("hidden")
              }}
              on:mouseleave={() => {
                document
                  .querySelector("#jangro-tooltip")
                  ?.classList.add("hidden")
              }}
              on:focus={null}
            >
              <input
                type="checkbox"
                id="a"
                checked={jikbunArray.find((element) => element == "장로") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#a").checked) {
                    document.querySelector("#a1").checked = false
                    document.querySelector("#a2").checked = false
                    document.querySelector("#a3").checked = false
                    document.querySelector("#a4").checked = false
                    document.querySelector("#a5").checked = false
                    jikbunArray = [
                      ...jikbunArray.filter((value) => !value.includes("장로")),
                      "장로",
                    ]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "장로"),
                    ]
                  }
                }}
              />
              <label for="a">장로</label>
              <div
                id="jangro-tooltip"
                class="hidden flex flex-col gap-2 absolute left-16 top-1/2 z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-3 px-4 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
                role="tooltip"
              >
                <span
                  class="absolute -left-1.5 top-1/2 -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-45 bg-white"
                ></span>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="a1"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "시무장로",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#a1").checked) {
                        document.querySelector("#a").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "장로"),
                          "시무장로",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "시무장로",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="a1">시무장로</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="a2"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "무임장로",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#a2").checked) {
                        document.querySelector("#a").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "장로"),
                          "무임장로",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임장로",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="a2">무임장로</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="a3"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "협동장로",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#a3").checked) {
                        document.querySelector("#a").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "장로"),
                          "협동장로",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "협동장로",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="a3">협동장로</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="a4"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "은퇴장로",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#a4").checked) {
                        document.querySelector("#a").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "장로"),
                          "은퇴장로",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "은퇴장로",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="a4">은퇴장로</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="a5"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "무임은퇴장로",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#a5").checked) {
                        document.querySelector("#a").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "장로"),
                          "무임은퇴장로",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임은퇴장로",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="a5">무임은퇴장로</label>
                </div>
              </div>
            </button>

            <!-- 권사 checkbox -->
            <button
              class="relative flex items-center text-gray-600 text-sm gap-2 px-3"
              on:mouseover={() => {
                document
                  .querySelector("#gwonsa-tooltip")
                  ?.classList.remove("hidden")
              }}
              on:mouseleave={() => {
                document
                  .querySelector("#gwonsa-tooltip")
                  ?.classList.add("hidden")
              }}
              on:focus={null}
            >
              <input
                type="checkbox"
                id="b"
                checked={jikbunArray.find((element) => element == "권사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#b").checked) {
                    document.querySelector("#b1").checked = false
                    document.querySelector("#b2").checked = false
                    document.querySelector("#b3").checked = false
                    document.querySelector("#b4").checked = false
                    jikbunArray = [
                      ...jikbunArray.filter((value) => !value.includes("권사")),
                      "권사",
                    ]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권사"),
                    ]
                  }
                }}
              />
              <label for="b">권사</label>
              <div
                id="gwonsa-tooltip"
                class="hidden flex flex-col gap-2 absolute left-16 top-1/2 z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-3 px-4 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
                role="tooltip"
              >
                <span
                  class="absolute -left-1.5 top-1/2 -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-45 bg-white"
                ></span>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="b1"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "시무권사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#b1").checked) {
                        document.querySelector("#b").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "권사"),
                          "시무권사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "시무권사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="b1">시무권사</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="b2"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "무임권사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#b2").checked) {
                        document.querySelector("#b").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "권사"),
                          "무임권사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임권사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="b2">무임권사</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="b3"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "은퇴권사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#b3").checked) {
                        document.querySelector("#b").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "권사"),
                          "은퇴권사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "은퇴권사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="b3">은퇴권사</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="b4"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "무임은퇴권사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#b4").checked) {
                        document.querySelector("#b").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter((item) => item != "권사"),
                          "무임은퇴권사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임은퇴권사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="b4">무임은퇴권사</label>
                </div>
              </div>
            </button>

            <!-- 안수집사 checkbox -->
            <button
              class="relative flex items-center text-gray-600 text-sm gap-2 px-3"
              on:mouseover={() => {
                document
                  .querySelector("#janglip-tooltip")
                  ?.classList.remove("hidden")
              }}
              on:mouseleave={() => {
                document
                  .querySelector("#janglip-tooltip")
                  ?.classList.add("hidden")
              }}
              on:focus={null}
            >
              <input
                type="checkbox"
                id="c"
                checked={jikbunArray.find(
                  (element) => element == "장립집사all",
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#c").checked) {
                    document.querySelector("#c1").checked = false
                    document.querySelector("#c2").checked = false
                    document.querySelector("#c3").checked = false
                    document.querySelector("#c4").checked = false

                    jikbunArray = [
                      ...jikbunArray.filter(
                        (value) => !value.includes("장립집사"),
                      ),
                      "장립집사all",
                    ]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "장립집사all"),
                    ]
                  }
                }}
              />
              <label for="c">장립집사</label>
              <div
                id="janglip-tooltip"
                class="hidden flex flex-col gap-2 absolute left-16 top-1/2 z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-3 px-4 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
                role="tooltip"
              >
                <span
                  class="absolute -left-1.5 top-1/2 -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-45 bg-white"
                ></span>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="c1"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "장립집사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c1").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all",
                          ),
                          "장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "장립집사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="c1">장립집사</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="c2"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "무임장립집사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c2").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all",
                          ),
                          "무임장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임장립집사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="c2">무임장립집사</label>
                </div>

                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="c3"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "은퇴장립집사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c3").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all",
                          ),
                          "은퇴장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "은퇴장립집사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="c3">은퇴장립집사</label>
                </div>

                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="c4"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "무임은퇴장립집사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c4").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all",
                          ),
                          "무임은퇴장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임은퇴장립집사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="c4">무임은퇴장립집사</label>
                </div>
              </div>
            </button>

            <!-- 서리집사 checkbox -->
            <button
              class="relative flex items-center text-gray-600 text-sm gap-2 px-3"
              on:mouseover={() => {
                document
                  .querySelector("#seori-tooltip")
                  ?.classList.remove("hidden")
              }}
              on:mouseleave={() => {
                document
                  .querySelector("#seori-tooltip")
                  ?.classList.add("hidden")
              }}
              on:focus={null}
            >
              <input
                type="checkbox"
                id="d"
                checked={jikbunArray.find(
                  (element) => element == "서리집사all",
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#d").checked) {
                    document.querySelector("#d1").checked = false

                    jikbunArray = [
                      ...jikbunArray.filter(
                        (value) => !value.includes("서리집사"),
                      ),
                      "서리집사all",
                    ]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "서리집사all"),
                    ]
                  }
                }}
              />
              <label for="d">서리집사</label>
              <div
                id="seori-tooltip"
                class="hidden flex flex-col gap-2 absolute left-16 top-1/2 z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-3 px-4 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
                role="tooltip"
              >
                <span
                  class="absolute -left-1.5 top-1/2 -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-45 bg-white"
                ></span>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="d1"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "서리집사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#d1").checked) {
                        document.querySelector("#d").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "서리집사all",
                          ),
                          "서리집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "서리집사all",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="d1">서리집사</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="d2"
                    class="text-xs mr-2"
                    checked={jikbunArray.find(
                      (element) => element == "명예서리집사",
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#d2").checked) {
                        document.querySelector("#d").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "서리집사all",
                          ),
                          "명예서리집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "명예서리집사",
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="d2">명예서리집사</label>
                </div>
              </div>
            </button>

            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="f"
                checked={jikbunArray.find((element) => element == "성도") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#f").checked) {
                    jikbunArray = [...jikbunArray, "성도"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "성도"),
                    ]
                  }
                }}
              />
              <label for="f">성도</label>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 소속 검색 -->
  <div class="flex flex-col w-full items-center">
    <div class="flex w-full items-center mx-auto text-sm">
      <div
        class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
      >
        <div class="flex flex-col w-full">
          <input
            id="group-dropdown"
            type="checkbox"
            class="hidden"
            on:change={(e) => {
              if (e.target.checked) {
                document.getElementById("groupBox")?.classList.remove("hidden")

                document.getElementById("group-down")?.classList.add("hidden")
                document.getElementById("group-up")?.classList.remove("hidden")
              } else {
                document.getElementById("groupBox")?.classList.add("hidden")
                document
                  .getElementById("group-down")
                  ?.classList.remove("hidden")
                document.getElementById("group-up")?.classList.add("hidden")
                document.getElementById("group1").value = ""
                document.getElementById("group2").value = ""
                group1 = ""
                group2 = ""
              }
            }}
          />
          <label class="flex w-full justify-between p-2" for="group-dropdown">
            <p class="select-none text-gray-400">소속</p>
            <ChevronDown id="group-down" class="cursor-pointer" />
            <ChevronUp id="group-up" class="hidden cursor-pointer" />
          </label>

          <div
            id="groupBox"
            class="hidden flex justify-between text-gray-600 border-t border-gray-300 focus:outline-0 px-5 gap-3"
          >
            <select
              id="group1"
              value={group1}
              on:change={() => {
                group1 = document.querySelector(
                  "#group1 > option:checked",
                ).value
                group2 = ""
              }}
              class="flex w-[50%] bg-gray-50 text-gray-600 text-sm focus:outline-0 py-2"
            >
              <option value="none" class="hidden" />
              {#each Object.keys(groupList) as group1}
                <option value={group1}>{group1}</option>
              {/each}
            </select>
            <div class="border-l border-gray-300" />

            <select
              id="group2"
              value={group2}
              required
              on:change={() => {
                group2 = document.querySelector("#group2").value
              }}
              class="flex w-[50%] bg-gray-50 text-gray-600 text-sm focus:outline-0 py-2"
            >
              <option value="none" class="hidden" />
              {#if group1 == "장년부"}
                {#each groupList["장년부"] as item}
                  <option value={item}>{item}</option>
                {/each}
              {:else if group1 == "청년부"}
                {#each groupList["청년부"] as item}
                  <option value={item}>{item}</option>
                {/each}
              {:else if group1 == "교회학교"}
                {#each groupList["교회학교"] as item}
                  <option value={item}>{item}</option>
                {/each}
              {/if}
            </select>
            <div
              class="border-l border-gray-300"
              class:hidden={group1 == "장년부" && group2 != "" ? false : true}
            />
            <select
              id="group2Add"
              value={group2Add}
              required
              on:change={() => {
                group2Add = document.querySelector("#group2Add").value
              }}
              class="flex bg-gray-50 text-gray-600 text-sm focus:outline-0 py-2"
              class:hidden={group1 == "장년부" && group2 != "" ? false : true}
            >
              <option value="none" class="hidden" />
              <option value="1구역">1구역</option>
              <option value="2구역">2구역</option>
              <option value="3구역">3구역</option>
              <option value="4구역">4구역</option>
              <option value="5구역">5구역</option>
              <option value="6구역">6구역</option>
              <option value="7구역">7구역</option>
              <option value="8구역">8구역</option>
              <option value="9구역">9구역</option>
              <option value="10구역">10구역</option>
              <option value="11구역">11구역</option>
              <option value="12구역">12구역</option>
              <option value="13구역">13구역</option>
              <option value="14구역">14구역</option>
              <option value="15구역">15구역</option>
              <option value="16구역">16구역</option>
              <option value="17구역">17구역</option>
              <option value="18구역">18구역</option>
              <option value="19구역">19구역</option>
              <option value="20구역">20구역</option>
              <option value="21구역">21구역</option>
              <option value="22구역">22구역</option>
              <option value="23구역">23구역</option>
              <option value="24구역">24구역</option>
              <option value="25구역">25구역</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 생년월일 검색-->
  <div class="flex flex-col w-full justify-center items-center">
    <div class="flex w-full items-center mx-auto text-sm">
      <div
        class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
      >
        <div class="flex flex-col w-full">
          <input
            id="birth-dropdown"
            type="checkbox"
            class="hidden"
            on:change={(e) => {
              if (e.target.checked) {
                document.getElementById("birthBox")?.classList.remove("hidden")

                document.getElementById("birth-down")?.classList.add("hidden")
                document.getElementById("birth-up")?.classList.remove("hidden")
              } else {
                const checkboxes = document.querySelectorAll("#birthBox input")
                document.getElementById("birthBox")?.classList.add("hidden")
                document
                  .getElementById("birth-down")
                  ?.classList.remove("hidden")
                document.getElementById("birth-up")?.classList.add("hidden")
                checkboxes.forEach((checkbox) => {
                  checkbox.checked = false
                })
              }
            }}
          />
          <label class="flex w-full justify-between p-2" for="birth-dropdown">
            <p class="select-none text-gray-400">생년월일</p>
            <ChevronDown id="birth-down" class="cursor-pointer" />
            <ChevronUp id="birth-up" class="hidden cursor-pointer" />
          </label>

          <div
            id="birthBox"
            class="hidden flex justify-between text-gray-600 border-t border-gray-300 focus:outline-0 px-5 py-2"
          >
            <input
              type="date"
              class="bg-gray-50 w-[40%] focus:outline-0"
              value={birthStart}
              on:input={(e) => {
                birthStart = e.target.value
              }}
            />
            <span>~</span>
            <input
              type="date"
              class="bg-gray-50 w-[40%] focus:outline-0"
              value={birthEnd}
              on:input={(e) => {
                birthEnd = e.target.value
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 그룹 트리 -->
  <div class="ml-2 flex flex-col mt-2 h-2/5 overflow-scroll">
    <div class="flex items-center pb-[10px] sticky top-0 bg-gray-50">
      {#if groupTree.name == className && semester == null}
        <DotFill width="12px" fill="#636363" />
      {:else}
        <DotBorder width="12px" fill="#c4c4c4" />
      {/if}
      <UserFilled
        fill={groupTree.name == className && semester == null
          ? "#636363"
          : "#c4c4c4"}
        size={16}
        class="mr-1"
      />
      <button
        class:font-bold={groupTree.name == className && semester == null
          ? true
          : false}
        on:click={() => {
          goto(`/educations/${groupTree.name}`)
        }}
      >
        {`${groupTree.name}(${groupTree.count})`}
      </button>
    </div>
    {#each groupTree.child as child}
      <div
        class="flex items-center pb-[10px] ml-3 sticky top-[30px] bg-gray-50"
      >
        {#if child.name == semester}
          <DotFill width="12px" fill="#636363" />
        {:else}
          <DotBorder width="12px" fill="#c4c4c4" />
        {/if}

        <UserFilled
          fill={child.name == semester ? "#636363" : "#c4c4c4"}
          size={16}
          class="mr-1"
        />
        <button
          class:font-bold={child.name == semester ? true : false}
          on:click={() => {
            if (groupTree.name == "전체") {
              goto(`/educations/${child.name}`)
            } else {
              goto(`/educations/${groupTree.name}?semester=${child.name}`)
            }
          }}
        >
          {`${child.name}(${child.count})`}</button
        >
      </div>
    {/each}
  </div>
</aside>
