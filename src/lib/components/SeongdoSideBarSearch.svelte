<script lang="ts">
  import { goto } from "$app/navigation"
  import type { ISeongdoSearchParams } from "$lib/interfaces"
  import { getSeongdosSearchParams } from "$lib/utils"
  import { ChevronDown, ChevronUp, Search } from "carbon-icons-svelte"

  export let searchParams: ISeongdoSearchParams
  $: name = ""
  $: jikbunArray = searchParams.jikbun ?? []

  const searchHandler = () => {
    const params = getSeongdosSearchParams({
      page: 1,
      name,
      jikbun: jikbunArray,
    })

    const url = params ? `/seongdos${params}` : "/seongdos"
    goto(url)
  }
</script>

<aside class="hidden-if-modile flex flex-col w-[30rem] px-6 py-8">
  <!-- 이름 검색 -->
  <form class="flex w-full items-center mx-auto mb-4">
    <input
      id="name"
      type="text"
      bind:value={name}
      on:focus={() => {
        name = ""
      }}
      class="w-full bg-gray-50 border-y border-l border-gray-300 text-gray-900 text-sm focus:outline-0 p-2"
      placeholder="이름"
    />
    <button
      class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
      on:click|preventDefault={searchHandler}
      ><Search size={20} class="text-gray-600" />
    </button>
  </form>

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
            class="grid grid-cols-3 border-t border-gray-300 focus:outline-0 p-2 hidden"
          >
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="a"
                checked={jikbunArray.find((element) => element == "장로") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#a").checked) {
                    jikbunArray = [...jikbunArray, "장로"]
                    // jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "장로"),
                    ]
                    // jikbunList.set(jikbunArray)
                  }
                }}
              />
              <label for="a">장로</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="b"
                checked={jikbunArray.find((element) => element == "안수집사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#b").checked) {
                    jikbunArray = [...jikbunArray, "안수집사"]
                    // jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "안수집사"),
                    ]
                    // jikbunList.set(jikbunArray)
                  }
                }}
              />
              <label for="b">안수집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="c"
                checked={jikbunArray.find((element) => element == "권사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#c").checked) {
                    jikbunArray = [...jikbunArray, "권사"]
                    // jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권사"),
                    ]
                    // jikbunList.set(jikbunArray)
                  }
                }}
              />
              <label for="c">권사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="d"
                checked={jikbunArray.find((element) => element == "집사") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#d").checked) {
                    jikbunArray = [...jikbunArray, "집사"]
                    // jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "집사"),
                    ]
                    // jikbunList.set(jikbunArray)
                  }
                }}
              />
              <label for="d">집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="e"
                checked={jikbunArray.find((element) => element == "권찰") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#e").checked) {
                    jikbunArray = [...jikbunArray, "권찰"]
                    // jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권찰"),
                    ]
                    // jikbunList.set(jikbunArray)
                  }
                }}
              />
              <label for="e">권찰</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="f"
                checked={jikbunArray.find((element) => element == "성도") !=
                  undefined}
                on:change={() => {
                  if (document.querySelector("#f").checked) {
                    jikbunArray = [...jikbunArray, "성도"]
                    // jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "성도"),
                    ]
                    // jikbunList.set(jikbunArray)
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
</aside>
