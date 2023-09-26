<script lang="ts">
  import { invalidateAll } from "$app/navigation"
  //icon
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte"
  import ChevronUp from "carbon-icons-svelte/lib/ChevronUp.svelte"
  import Search from "carbon-icons-svelte/lib/Search.svelte"

  //component
  import CheckableTable from "./CheckableTable.svelte"
  import Pagination from "./Pagination.svelte"
  import EducationSideBar from "./EducationSideBar.svelte"

  //variable
  import {
    checkedSeongdo,
    eduName,
    seongdoResponse,
    page,
    jikbunList,
  } from "$lib"
  import { onMount } from "svelte"
  import { getSeongdos, getSeongdosNotInEdu } from "$lib/fetch"
  import { Save, UserFollow } from "carbon-icons-svelte"

  let name = ""
  let jikbunArray: string[] = []

  onMount(async () => {
    const response = await getSeongdosNotInEdu({ eduName: $eduName })
    if (response.ok) {
      seongdoResponse.set(await response.json())
    }
  })

  const searchHandler = async (name: string, jikbun?: string[]) => {
    const response = await fetch(`/api/seongdos/searchNotIn`, {
      method: "POST",
      body: JSON.stringify({ name, jikbun, eduName: $eduName }),
      headers: {
        "content-type": "application/json",
      },
    })

    if (response.ok) {
      seongdoResponse.set(await response.json())
      name = ""
    }
  }
</script>

<EducationSideBar />

<aside class="flex flex-col w-1/4 px-6 py-8">
  <!--   
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
      on:click={() => {
        searchHandler(name, jikbunArray)
      }}
      ><Search size={20} class="text-gray-600" />
    </button>
  </form>

  
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
                jikbunArray = []
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
            class="hidden grid grid-cols-3 border-t border-gray-300 focus:outline-0 p-2"
          >
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="a"
                on:change={() => {
                  if (document.querySelector("#a").checked) {
                    jikbunArray = [...jikbunArray, "장로"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "장로"),
                    ]
                  }
                }}
              /> <label for="a">장로</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="b"
                on:change={() => {
                  if (document.querySelector("#b").checked) {
                    jikbunArray = [...jikbunArray, "안수집사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "안수집사"),
                    ]
                  }
                }}
              /> <label for="b">안수집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="c"
                on:change={() => {
                  if (document.querySelector("#c").checked) {
                    jikbunArray = [...jikbunArray, "권사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권사"),
                    ]
                  }
                }}
              /> <label for="c">권사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="d"
                on:change={() => {
                  if (document.querySelector("#d").checked) {
                    jikbunArray = [...jikbunArray, "집사"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "집사"),
                    ]
                  }
                }}
              /> <label for="d">집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="e"
                on:change={() => {
                  if (document.querySelector("#e").checked) {
                    jikbunArray = [...jikbunArray, "평성도"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "평성도"),
                    ]
                  }
                }}
              /> <label for="e">평성도</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                type="checkbox"
                id="f"
                on:change={() => {
                  if (document.querySelector("#f").checked) {
                    jikbunArray = [...jikbunArray, "청년"]
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "청년"),
                    ]
                  }
                }}
              /> <label for="f">청년</label>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
   -->
</aside>

<div
  id="content"
  class="items-center flex flex-col px-12 pt-8 pb-15 flex w-full bg-white overflow-x-scroll"
>
  <div class="flex w-full justify-between mb-2">
    <div class="flex items-center">
      <p class="text-lg font-medium mr-1">{$eduName} 추가</p>
      <p class="text-lg">
        {Object.values($checkedSeongdo).filter((value) => value == true)
          .length == 0
          ? ""
          : `(${
              Object.values($checkedSeongdo).filter((value) => value == true)
                .length
            }명 선택)`}
      </p>
    </div>
    <div class="flex rounded gap-3">
      <button
        class="flex h-fit border-[#FBA244] border items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
        on:click={async () => {
          let ids = Object.keys($checkedSeongdo).map((key) => {
            if ($checkedSeongdo[key] == true) {
              return key
            }
          })
          ids = ids.filter((value) => value != undefined)

          const response = await fetch(`/api/seongdos/addEdu`, {
            method: "POST",
            body: JSON.stringify({ ids, eduName: $eduName }),
            headers: {
              "content-type": "application/json",
            },
          })

          if (response.ok) {
            const result = await getSeongdos({ eduName: $eduName })
            if (result.ok) {
              checkedSeongdo.set({})
              page.set("education")
              seongdoResponse.set(await result.json())
              alert("추가되었습니다.")
            }
          }
        }}
      >
        <Save scale={16} />
        <span>저장</span>
      </button>
      <button
        class="h-fit border-gray-300 bg-white border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
        on:click={async () => {
          const response = await getSeongdos({
            name,
            eduName: $eduName,
          })
          if (response.ok) {
            checkedSeongdo.set({})
            seongdoResponse.set(await response.json())
          }
          page.set("education")
          jikbunList.set([])
        }}
      >
        <span class="flex items-center">
          <p class="font-medium mr-1 text-[#FBA244]">X</p>
          <p>취소</p>
        </span>
      </button>
    </div>
  </div>
  <!-- 테이블 -->
  <CheckableTable />
  <Pagination />
</div>
