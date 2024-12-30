<script lang="ts">
  import DotFill from "./../icon/DotFill.svelte"
  import DotBorder from "./../icon/DotBorder.svelte"
  import { goto } from "$app/navigation"
  import type { IGroup, ISeongdoSearchParams } from "$lib/interfaces"
  import { UserFilled } from "carbon-icons-svelte"
  import { ChevronDown, ChevronUp, Renew, Search } from "carbon-icons-svelte"
  import { getGroupItem, getSearchParams } from "$lib/utils"

  export let groupTree: IGroup
  export let searchParams: ISeongdoSearchParams
  $: groupItem = getGroupItem(searchParams.group1, searchParams.group2)
  $: group1 = searchParams.group1
  $: group2 = searchParams.group2
  $: name = searchParams.name
  $: phone = searchParams.phone
  $: jikbunArray = searchParams.jikbun ?? []
  $: birthStart = searchParams.birthStart
  $: birthEnd = searchParams.birthEnd

  const searchHandler = () => {
    if (phone) {
      name = ""
    }
    const params = getSearchParams({
      page: 1,
      name,
      phone,
      jikbun: jikbunArray,
      birthStart,
      birthEnd,
      group1,
      group2,
    })

    const url = params ? `/seongdos${params}` : "/seongdos"
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
          goto("/seongdos")
        }}
      >
        <Renew size={20} class="text-gray-600" />
      </button>
    </div>
    <form class="flex flex-auto items-center mx-auto">
      <input
        id="name"
        type="text"
        value={name || phone}
        on:focus={() => {
          name = ""
          phone = ""
        }}
        on:input={(e) => {
          name = e.target.value
          phone = Number(name) ? name : ""
        }}
        class="w-full bg-gray-50 border-y border-l border-gray-300 text-gray-900 text-sm focus:outline-0 p-2"
        placeholder="이름 or 전화번호"
      />
      <button
        type="submit"
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click|preventDefault={searchHandler}
        ><Search size={20} class="text-gray-600" />
      </button>
    </form>
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
                  "#jikbun-dropdown input"
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
                      (element) => element == "시무장로"
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
                            (value) => value !== "시무장로"
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
                      (element) => element == "무임장로"
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
                            (value) => value !== "무임장로"
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
                      (element) => element == "협동장로"
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
                            (value) => value !== "협동장로"
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
                      (element) => element == "은퇴장로"
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
                            (value) => value !== "은퇴장로"
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
                      (element) => element == "무임은퇴장로"
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
                            (value) => value !== "무임은퇴장로"
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
                      (element) => element == "시무권사"
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
                            (value) => value !== "시무권사"
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
                      (element) => element == "무임권사"
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
                            (value) => value !== "무임권사"
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
                      (element) => element == "은퇴권사"
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
                            (value) => value !== "은퇴권사"
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
                      (element) => element == "무임은퇴권사"
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
                            (value) => value !== "무임은퇴권사"
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
                  (element) => element == "장립집사all"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#c").checked) {
                    document.querySelector("#c1").checked = false
                    document.querySelector("#c2").checked = false
                    document.querySelector("#c3").checked = false
                    document.querySelector("#c4").checked = false

                    jikbunArray = [
                      ...jikbunArray.filter(
                        (value) => !value.includes("장립집사")
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
                      (element) => element == "장립집사"
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c1").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all"
                          ),
                          "장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "장립집사"
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
                      (element) => element == "무임장립집사"
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c2").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all"
                          ),
                          "무임장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임장립집사"
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
                      (element) => element == "은퇴장립집사"
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c3").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all"
                          ),
                          "은퇴장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "은퇴장립집사"
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
                      (element) => element == "무임은퇴장립집사"
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#c4").checked) {
                        document.querySelector("#c").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "장립집사all"
                          ),
                          "무임은퇴장립집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "무임은퇴장립집사"
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
                  (element) => element == "서리집사all"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#d").checked) {
                    document.querySelector("#d1").checked = false

                    jikbunArray = [
                      ...jikbunArray.filter(
                        (value) => !value.includes("서리집사")
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
                      (element) => element == "서리집사"
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#d1").checked) {
                        document.querySelector("#d").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "서리집사all"
                          ),
                          "서리집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "서리집사all"
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
                      (element) => element == "명예서리집사"
                    ) != undefined}
                    on:change={() => {
                      if (document.querySelector("#d2").checked) {
                        document.querySelector("#d").checked = false
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (item) => item != "서리집사all"
                          ),
                          "명예서리집사",
                        ]
                      } else {
                        jikbunArray = [
                          ...jikbunArray.filter(
                            (value) => value !== "명예서리집사"
                          ),
                        ]
                      }
                    }}
                  />
                  <label for="d2">명예서리집사</label>
                </div>
              </div>
            </button>
            <!-- 권찰 checkbox -->
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="e"
                checked={jikbunArray.find((element) => element == "권찰") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#e").checked) {
                    jikbunArray = [...jikbunArray, "권찰"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권찰"),
                    ]
                  }
                }}
              />
              <label for="e">권찰</label>
            </p>
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

  <!-- 생년월일 검색 -->
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
      {#if groupTree.name == group1 && group2 == null}
        <DotFill width="12px" fill="#636363" />
      {:else}
        <DotBorder width="12px" fill="#c4c4c4" />
      {/if}
      <UserFilled
        fill={groupTree.name == group1 && group2 == null
          ? "#636363"
          : "#c4c4c4"}
        size={16}
        class="mr-1"
      />
      <button
        class:font-bold={groupTree.name == group1 && group2 == null
          ? true
          : false}
        on:click={() => {
          goto(`/seongdos?group1=${groupTree.name}`)
        }}
      >
        {["청년부", "교회학교"].includes(group1)
          ? `${groupTree.name}(${groupTree.count} / ${groupTree.teacherCount})`
          : `${groupTree.name}(${groupTree.count})`}
      </button>
    </div>
    {#each groupTree.child as child}
      <div
        class="flex items-center pb-[10px] ml-3 sticky top-[30px] bg-gray-50"
      >
        {#if child.name == group2}
          <DotFill width="12px" fill="#636363" />
        {:else}
          <DotBorder width="12px" fill="#c4c4c4" />
        {/if}

        <UserFilled
          fill={child.name == group2 ? "#636363" : "#c4c4c4"}
          size={16}
          class="mr-1"
        />
        <button
          class:font-bold={child.name == group2 ? true : false}
          on:click={() => {
            goto(`/seongdos?group1=${groupTree.name}&group2=${child.name}`)
          }}
        >
          {["청년부", "교회학교"].includes(group1) &&
          !["늘푸른부", "은혜브릿지"].includes(child.name)
            ? `${child.name}(${child.count} / ${child.teacherCount})`
            : `${child.name}(${child.count})`}</button
        >
      </div>
      <div class="flex flex-col">
        {#if child.name == groupItem.group2}
          <!-- content here -->

          {#each child.child as secondChild}
            <div id={secondChild.name} class="flex items-center pb-[7px] ml-6">
              {#if child.name + "," + secondChild.name == group2}
                <DotFill width="12px" fill="#636363" />
              {:else}
                <DotBorder width="12px" fill="#c4c4c4" />
              {/if}
              <UserFilled
                fill={child.name + "," + secondChild.name == group2
                  ? "#636363"
                  : "#c4c4c4"}
                size={16}
                class="mr-1"
              />
              <button
                class:font-bold={child.name + "," + secondChild.name == group2
                  ? true
                  : false}
                on:click={() => {
                  goto(
                    `/seongdos?group1=${groupTree.name}&group2=${child.name},${secondChild.name}`
                  )
                }}>{`${secondChild.name}(${secondChild.count})`}</button
              >
            </div>
          {/each}
        {/if}
      </div>
    {/each}
  </div>
</aside>
