<script lang="ts">
  import { goto } from "$app/navigation"
  import type { ISeongdoSearchParams } from "$lib/interfaces"
  import { getSearchParams } from "$lib/utils"
  import { ChevronDown, ChevronUp, Renew, Search } from "carbon-icons-svelte"

  export let searchParams: ISeongdoSearchParams
  $: name = searchParams.name
  $: jikbunArray = searchParams.jikbun ?? []
  $: simbangjaArray = searchParams.simbangja ?? []
  $: dateStart = searchParams.dateStart
  $: dateEnd = searchParams.dateEnd

  const searchHandler = () => {
    const params = getSearchParams({
      page: 1,
      name,
      jikbun: jikbunArray,
      simbangja: simbangjaArray,
      dateStart,
      dateEnd,
    })

    const url = params ? `/simbangs${params}` : "/simbangs"
    goto(url)
  }
</script>

<aside class="hidden-if-modile flex flex-col w-[30rem] px-6 py-8 gap-4">
  <!-- 이름 검색 -->
  <div class="flex gap-2">
    <div class="flex flex-none items-center mx-auto">
      <button
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click={() => {
          goto("/simbangs")
        }}
      >
        <Renew size={20} class="text-gray-600" />
      </button>
    </div>
    <form class="flex flex-auto items-center mx-auto">
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
        type="submit"
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click|preventDefault={searchHandler}
        ><Search size={20} class="text-gray-600" />
      </button>
    </form>
  </div>

  <!-- 심방자 검색 -->
  <div class="flex flex-col w-full justify-center items-center">
    <div class="flex w-full items-center mx-auto">
      <div
        class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
      >
        <div class="flex flex-col w-full">
          <input
            type="checkbox"
            id="dropdown"
            checked
            class="simbangja-input hidden"
            on:change={(e) => {
              if (e.target.checked) {
                document
                  .getElementById("simbangja-dropdown")
                  ?.classList.remove("hidden")

                document
                  .getElementById("simbangja-down")
                  ?.classList.add("hidden")
                document
                  .getElementById("simbangja-up")
                  ?.classList.remove("hidden")
              } else {
                const checkboxes = document.querySelectorAll(
                  "#simbangja-dropdown input"
                )
                document
                  .getElementById("simbangja-dropdown")
                  ?.classList.add("hidden")
                document
                  .getElementById("simbangja-down")
                  ?.classList.remove("hidden")
                document.getElementById("simbangja-up")?.classList.add("hidden")
                checkboxes.forEach((checkbox) => {
                  checkbox.checked = false
                })
              }
            }}
          />
          <label class="flex w-full justify-between p-2" for="dropdown">
            <p class="text-gray-400 text-sm select-none">심방자</p>
            <ChevronDown id="simbangja-down" class="hidden cursor-pointer" />
            <ChevronUp id="simbangja-up" class="cursor-pointer" />
          </label>

          <div
            id="simbangja-dropdown"
            class="grid grid-cols-2 gap-[5px] border-t border-gray-300 focus:outline-0 px-3 py-2"
          >
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="simbanga"
                checked={simbangjaArray.find(
                  (element) => element == "고재국 담임목사"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#simbanga").checked) {
                    simbangjaArray = [...simbangjaArray, "고재국 담임목사"]
                  } else {
                    simbangjaArray = [
                      ...simbangjaArray.filter(
                        (value) => value !== "고재국 담임목사"
                      ),
                    ]
                  }
                }}
              />
              <label for="simbanga">고재국 담임목사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="simbangb"
                checked={simbangjaArray.find(
                  (element) => element == "김성태 목사"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#simbangb").checked) {
                    simbangjaArray = [...simbangjaArray, "김성태 목사"]
                  } else {
                    simbangjaArray = [
                      ...simbangjaArray.filter(
                        (value) => value !== "김성태 목사"
                      ),
                    ]
                  }
                }}
              />
              <label for="simbangb">김성태 목사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="simbangc"
                checked={simbangjaArray.find(
                  (element) => element == "함정훈 목사"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#simbangc").checked) {
                    simbangjaArray = [...simbangjaArray, "함정훈 목사"]
                  } else {
                    simbangjaArray = [
                      ...simbangjaArray.filter(
                        (value) => value !== "함정훈 목사"
                      ),
                    ]
                  }
                }}
              />
              <label for="simbangc">함정훈 목사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="simbangd"
                checked={simbangjaArray.find(
                  (element) => element == "김용은 목사"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#simbangd").checked) {
                    simbangjaArray = [...simbangjaArray, "김용은 목사"]
                  } else {
                    simbangjaArray = [
                      ...simbangjaArray.filter(
                        (value) => value !== "김용은 목사"
                      ),
                    ]
                  }
                }}
              />
              <label for="simbangd">김용은 목사</label>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 직분 검색 -->
  <!-- <div class="flex flex-col w-full justify-center items-center">
    <div class="flex w-full items-center mx-auto">
      <div
        class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
      >
        <div class="flex flex-col w-full">
          <input
            type="checkbox"
            id="dropdown"
            checked
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
            <ChevronDown id="jikbun-down" class="hidden cursor-pointer" />
            <ChevronUp id="jikbun-up" class="cursor-pointer" />
          </label>

          <div
            id="jikbun-dropdown"
            class="grid grid-cols-2 gap-[5px] border-t border-gray-300 focus:outline-0 px-3 py-2"
          >
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="a"
                checked={jikbunArray.find((element) => element == "장로") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#a").checked) {
                    jikbunArray = [...jikbunArray, "장로"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "장로"),
                    ]
                  }
                }}
              />
              <label for="a">장로</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="b"
                checked={jikbunArray.find((element) => element == "안수집사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#b").checked) {
                    jikbunArray = [...jikbunArray, "안수집사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "안수집사"),
                    ]
                  }
                }}
              />
              <label for="b">안수집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="c"
                checked={jikbunArray.find((element) => element == "권사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#c").checked) {
                    jikbunArray = [...jikbunArray, "권사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권사"),
                    ]
                  }
                }}
              />
              <label for="c">권사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="d"
                checked={jikbunArray.find((element) => element == "은퇴권사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#d").checked) {
                    jikbunArray = [...jikbunArray, "은퇴권사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "은퇴권사"),
                    ]
                  }
                }}
              />
              <label for="d">은퇴권사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="e"
                checked={jikbunArray.find((element) => element == "무임권사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#e").checked) {
                    jikbunArray = [...jikbunArray, "무임권사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "무임권사"),
                    ]
                  }
                }}
              />
              <label for="e">무임권사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="f"
                checked={jikbunArray.find(
                  (element) => element == "무임은퇴권사"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#f").checked) {
                    jikbunArray = [...jikbunArray, "무임은퇴권사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter(
                        (value) => value !== "무임은퇴권사"
                      ),
                    ]
                  }
                }}
              />
              <label for="f">무임은퇴권사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="g"
                checked={jikbunArray.find((element) => element == "서리집사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#g").checked) {
                    jikbunArray = [...jikbunArray, "서리집사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "서리집사"),
                    ]
                  }
                }}
              />
              <label for="g">서리집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="h"
                checked={jikbunArray.find((element) => element == "은퇴집사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#h").checked) {
                    jikbunArray = [...jikbunArray, "은퇴집사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "은퇴집사"),
                    ]
                  }
                }}
              />
              <label for="h">은퇴집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="i"
                checked={jikbunArray.find((element) => element == "무임집사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#i").checked) {
                    jikbunArray = [...jikbunArray, "무임집사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "무임집사"),
                    ]
                  }
                }}
              />
              <label for="i">무임집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="j"
                checked={jikbunArray.find(
                  (element) => element == "무임은퇴집사"
                ) != undefined}
                on:change={() => {
                  if (document.querySelector("#j").checked) {
                    jikbunArray = [...jikbunArray, "무임은퇴집사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter(
                        (value) => value !== "무임은퇴집사"
                      ),
                    ]
                  }
                }}
              />
              <label for="j">무임은퇴집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="k"
                checked={jikbunArray.find((element) => element == "권찰") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#k").checked) {
                    jikbunArray = [...jikbunArray, "권찰"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권찰"),
                    ]
                  }
                }}
              />
              <label for="k">권찰</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2 px-3">
              <input
                type="checkbox"
                id="l"
                checked={jikbunArray.find((element) => element == "성도") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#l").checked) {
                    jikbunArray = [...jikbunArray, "성도"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "성도"),
                    ]
                  }
                }}
              />
              <label for="l">성도</label>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div> -->

  <!-- 심방날짜 검색 -->
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
            checked
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
            <p class="select-none text-gray-400">심방날짜</p>
            <ChevronDown id="birth-down" class="hidden cursor-pointer" />
            <ChevronUp id="birth-up" class="cursor-pointer" />
          </label>

          <div
            id="birthBox"
            class="flex justify-between text-gray-600 border-t border-gray-300 focus:outline-0 px-5 py-2"
          >
            <input
              type="date"
              class="bg-gray-50 w-[40%] focus:outline-0"
              value={dateStart}
              on:input={(e) => {
                dateStart = e.target.value
              }}
            />
            <span>~</span>
            <input
              type="date"
              class="bg-gray-50 w-[40%] focus:outline-0"
              value={dateEnd}
              on:input={(e) => {
                dateEnd = e.target.value
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</aside>
