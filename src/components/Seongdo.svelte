<script lang="ts">
  import {
    getSeongdos,
    jikbunList,
    page,
    searchName,
    seongdoResponse,
  } from "$lib"
  import { utils, writeFile } from "xlsx"

  onMount(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      window.navigator.userAgent
    )
    console.log(isMobile)
  })

  //icon
  import ChevronDown from "carbon-icons-svelte/lib/ChevronDown.svelte"
  import ChevronUp from "carbon-icons-svelte/lib/ChevronUp.svelte"
  import Search from "carbon-icons-svelte/lib/Search.svelte"
  import UserFollow from "carbon-icons-svelte/lib/UserFollow.svelte"
  import UserMultiple from "carbon-icons-svelte/lib/UserMultiple.svelte"

  //component
  import Table from "./Table.svelte"
  import SeongdoSideBar from "./SeongdoSideBar.svelte"
  import Pagination from "./Pagination.svelte"
  import { Document } from "carbon-icons-svelte"
  import { getAllSeongdos } from "$lib/fetch"
  import { onMount } from "svelte"

  //variable
  $: name = $searchName
  $: jikbunArray = $jikbunList

  const searchHandler = async (name: string, jikbun?: string[]) => {
    const response = await getSeongdos({ name, jikbun })
    if (response.ok) {
      seongdoResponse.set(await response.json())
      searchName.set(name)
    }
  }
</script>

<SeongdoSideBar />

<aside class="flex flex-col w-1/4 px-6 py-8">
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
      on:click={() => {
        searchHandler(name, jikbunArray)
      }}
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
                jikbunArray = []
                jikbunList.set([])
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
                checked={jikbunArray.find((element) => element == "장로") !=
                  undefined}
                type="checkbox"
                id="a"
                on:change={() => {
                  if (document.querySelector("#a").checked) {
                    jikbunArray = [...jikbunArray, "장로"]
                    jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "장로"),
                    ]
                    jikbunList.set(jikbunArray)
                  }
                }}
              /> <label for="a">장로</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                checked={jikbunArray.find((element) => element == "안수집사") !=
                  undefined}
                type="checkbox"
                id="b"
                on:change={() => {
                  if (document.querySelector("#b").checked) {
                    jikbunArray = [...jikbunArray, "안수집사"]
                    jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "안수집사"),
                    ]
                    jikbunList.set(jikbunArray)
                  }
                }}
              /> <label for="b">안수집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                checked={jikbunArray.find((element) => element == "권사") !=
                  undefined}
                type="checkbox"
                id="c"
                on:change={() => {
                  if (document.querySelector("#c").checked) {
                    jikbunArray = [...jikbunArray, "권사"]
                    jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "권사"),
                    ]
                    jikbunList.set(jikbunArray)
                  }
                }}
              /> <label for="c">권사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                checked={jikbunArray.find((element) => element == "집사") !=
                  undefined}
                type="checkbox"
                id="d"
                on:change={() => {
                  if (document.querySelector("#d").checked) {
                    jikbunArray = [...jikbunArray, "집사"]
                    jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "집사"),
                    ]
                    jikbunList.set(jikbunArray)
                  }
                }}
              /> <label for="d">집사</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                checked={jikbunArray.find((element) => element == "평성도") !=
                  undefined}
                type="checkbox"
                id="e"
                on:change={() => {
                  if (document.querySelector("#e").checked) {
                    jikbunArray = [...jikbunArray, "평성도"]
                    jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "평성도"),
                    ]
                    jikbunList.set(jikbunArray)
                  }
                }}
              /> <label for="e">평성도</label>
            </p>
            <p class="flex text-gray-600 text-sm gap-2">
              <input
                checked={jikbunArray.find((element) => element == "청년") !=
                  undefined}
                type="checkbox"
                id="f"
                on:change={() => {
                  if (document.querySelector("#f").checked) {
                    jikbunArray = [...jikbunArray, "청년"]
                    jikbunList.set(jikbunArray)
                  } else {
                    jikbunArray = [
                      ...jikbunArray.filter((value) => value !== "청년"),
                    ]
                    jikbunList.set(jikbunArray)
                  }
                }}
              /> <label for="f">청년</label>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</aside>

<div
  id="content"
  class="items-center flex flex-col px-12 pt-8 pb-15 flex w-full bg-white overflow-x-scroll"
>
  <div class="flex w-full justify-between mb-2">
    <div class="flex items-center">
      <p class="text-lg font-medium mr-1">성도 목록</p>
      <p class="text-lg">
        {`(${$seongdoResponse.total}명)`}
      </p>
    </div>
    <div class="rounded flex ml-auto gap-2">
      <button
        class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
        on:click={() => {
          page.set("seongdoAdd")
        }}
      >
        <UserFollow scale={16} />
        <span>등록</span>
      </button>
      <button
        class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
        on:click={() => {
          page.set("seongdoAddMulti")
        }}
      >
        <UserMultiple scale={16} />
        <span>여러명 등록</span>
      </button>
      <button
        class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#237334]"
        on:click={async () => {
          let seongdos
          let response = await getAllSeongdos()
          if (response.ok) {
            seongdos = (await response.json()).seongdos
          }

          let seongdosForSheet
          seongdosForSheet = seongdos.map((item) => {
            return {
              이름: item.name,
              직분: item.jikbun,
              생년월일: item.birth,
              나이: item.age,
              핸드폰: item.phone,
              주소: item.address,
              수강내역: item.eduIds
                .map((edu) => {
                  return edu.name
                })
                .toString(),
            }
          })

          const worksheet = utils.json_to_sheet(seongdosForSheet)
          const workbook = utils.book_new()
          utils.book_append_sheet(workbook, worksheet)
          writeFile(
            workbook,
            `성도목록_${new Date().toISOString().substring(0, 10)}.xlsx`
          )
        }}
      >
        <Document scale={16} />
        <span>엑셀로 내보내기</span>
      </button>
    </div>
  </div>
  <Table />
  <Pagination />
</div>
