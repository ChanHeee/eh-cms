<script lang="ts">
  import TableForDelete from "./TableForDelete.svelte"
  import Table from "./Table.svelte"
  import type { IPage, ISeongdo, ISeongdoSearchParams } from "$lib/interfaces"
  import { utils, writeFile } from "xlsx"
  import {
    ChevronDown,
    ChevronUp,
    Close,
    Document,
    OverflowMenuHorizontal,
    Renew,
    Search,
    TrashCan,
    UserFollow,
    UserMultiple,
  } from "carbon-icons-svelte"
  import { goto } from "$app/navigation"
  import { getGroupItem, getSearchParams } from "$lib/utils"
  import toast from "svelte-french-toast"
  import { SeongdoDeleteIdsStore } from "$lib/store"

  export let data: {
    seongdos: ISeongdo[]
    page: IPage
    allowedGroup: string[]
    deleteMany: boolean
    groupList: any
    searchParams: ISeongdoSearchParams
  }

  $: seongdos = data.seongdos
  $: page = data.page
  $: requestParams = page.requestParams

  $: searchParams = data.searchParams
  $: name = searchParams.name
  $: phone = searchParams.phone
  $: jikbunArray = searchParams.jikbun ?? []
  $: birthStart = searchParams.birthStart
  $: birthEnd = searchParams.birthEnd

  $: allowedGroup = data.allowedGroup
  $: groupItem = getGroupItem(
    page.requestParams.group1 as string,
    page.requestParams.group2 as string
  )
  $: group1 = groupItem.group1
  $: group2 = groupItem.group2
  $: group2Add = groupItem.group2Add ?? ""

  // $: group1 = page.requestParams.group1
  // $: group2 = page.requestParams.group2
  $: groupList = data.groupList

  $: deleteMany = data.deleteMany
  $: ids = $SeongdoDeleteIdsStore

  $: isSearchModalHidden = true

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
      group2: group2Add ? group2 + "," + group2Add : group2,
    })

    const url = params ? `/seongdos${params}` : "/seongdos"
    goto(url)
  }

  const deleteHandler = async (ids: string[]) => {
    const response = await fetch("/api/seongdos", {
      method: "DELETE",
      body: JSON.stringify({
        ids,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      toast.success("삭제되었습니다.")
      ids = []
      history.back()
    }
  }
</script>

<div
  id="content"
  class="flex flex-col px-6 sm:px-16 pb-15 flex w-full bg-white overflow-scroll"
>
  <div class="flex md:hidden gap-2 mt-8">
    <div class="flex flex-none items-center mx-auto">
      <button
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click={() => {
          name = ""
          goto("/seongdos")
        }}
      >
        <Renew size={20} class="text-gray-600" />
      </button>
    </div>
    <form class="flex w-full items-center mx-auto">
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
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click|preventDefault={searchHandler}
        ><Search size={20} class="text-gray-600" />
      </button>
    </form>
    <div class="flex flex-none items-center mx-auto">
      <button
        class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
        on:click={() => {
          isSearchModalHidden = !isSearchModalHidden
        }}
      >
        <OverflowMenuHorizontal size={20} class="text-gray-600" />
      </button>
    </div>
  </div>
  <div class="flex md:hidden flex-col w-full items-center mt-4">
    <!-- <div class="flex w-full items-center mx-auto text-sm">
      <div
        class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
      >
        <div class="flex flex-col w-full">
          <input
            type="checkbox"
            id="dropdownForGroup"
            class="group-input hidden"
            on:change={(e) => {
              if (e.target.checked) {
                document
                  .getElementById("group-dropdown")
                  ?.classList.remove("hidden")

                document.getElementById("group-down")?.classList.add("hidden")
                document.getElementById("group-up")?.classList.remove("hidden")
              } else {
                const checkboxes = document.querySelectorAll(
                  "#group-dropdown input"
                )
                document
                  .getElementById("group-dropdown")
                  ?.classList.add("hidden")
                document
                  .getElementById("group-down")
                  ?.classList.remove("hidden")
                document.getElementById("group-up")?.classList.add("hidden")
                checkboxes.forEach((checkbox) => {
                  checkbox.checked = false
                })
              }
            }}
          />
          <label class="flex w-full justify-between p-2" for="dropdownForGroup">
            <p class="select-none text-gray-400">소속</p>
            <ChevronDown id="group-down" class=" cursor-pointer" />
            <ChevronUp id="group-up" class="hidden cursor-pointer" />
          </label>

          <div
            id="group-dropdown"
            class="hidden flex justify-between text-gray-600 border-t border-gray-300 focus:outline-0 px-5 gap-3"
          >
            <select
              id="group1"
              value={group1}
              on:change={() => {
                group1 = document.querySelector(
                  "#group1 > option:checked"
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
                group2Add = ""
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
    </div> -->
  </div>

  <div class="flex flex-col mb-3">
    <div
      class=" bg-white pt-8 bg-white sticky top-0 flex w-full justify-between pb-2"
    >
      <div class="flex items-center">
        <p class="text-lg font-medium mr-1">성도 목록</p>
        <p class="text-lg">
          {`(${page.totalSize}명)`}
        </p>
      </div>
      <div class="rounded flex ml-auto gap-2">
        <!-- <button
          class="hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#237334]"
          on:click={async () => {
            const { take, ...rest } = requestParams
            let seongdos
            let response = await await fetch(
              `/api/seongdos${getSearchParams({ ...rest, take: 10000 })}`,
              {
                method: "GET",
                headers: {
                  "content-type": "application/json",
                },
              }
            )
            if (response.ok) {
              seongdos = (await response.json()).seongdos
              console.log(seongdos)
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
              }
            })

            const worksheet = utils.json_to_sheet(seongdosForSheet)
            const workbook = utils.book_new()
            utils.book_append_sheet(workbook, worksheet)
            writeFile(
              workbook,
              `성도목록_${new Date()
                .toISOString()
                .substring(0, 10)}${getSearchParams({ ...rest })}.xlsx`
            )
          }}
        >
          <Document scale={16} />
          <span>엑셀로 내보내기</span>
        </button> -->

        {#if deleteMany}
          <button
            class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={async () => {
              if (ids.length == 0) {
                toast.error("선택된 성도가 없습니다.")
              } else if (
                !confirm(
                  `선택된 ${ids.length}명의 성도 정보를 삭제하시겠습니까?`
                )
              ) {
                return false
              } else {
                await deleteHandler(ids)
              }
            }}
          >
            <TrashCan scale={16} />
            <span>삭제</span>
          </button>

          <button
            type="button"
            class="flex h-fit items-center gap-1 rounded-sm text-xs px-2 py-[0.335rem] border-gray-300 border"
            on:click={async () => {
              goto("/seongdos")
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
        {:else}
          <button
            class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={() => {
              goto("/seongdos/add")
            }}
          >
            <UserFollow scale={16} />
            <span>등록</span>
          </button>

          <button
            class="hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={() => {
              goto("/seongdos/addMany")
            }}
          >
            <UserMultiple scale={16} />
            <span>여러명 등록</span>
          </button>
          <button
            type="button"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={() => {
              goto("/seongdos?deleteMany=true")
            }}
          >
            <TrashCan scale={16} />
            <span>여러명 삭제</span>
          </button>
        {/if}
      </div>
    </div>
    {#if deleteMany}
      <TableForDelete {seongdos} {page} {allowedGroup} />
    {:else}
      <Table {seongdos} {page} />
    {/if}
  </div>
</div>

<div
  class="relative z-10 h-full"
  class:hidden={isSearchModalHidden}
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
  <div class="w-full fixed inset-0 z-10 w-screen">
    <div
      class="h-full flex min-h-full items-end justify-center p-4 text-center items-center"
    >
      <div
        class="sm:h-2/3 h-3/4 sm:max-md:w-2/3 md:w-1/3 w-full relative transform rounded-md bg-white shadow-xl transition-all"
      >
        <div
          class="overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
        >
          <h1 class="text-left text-lg font-medium mb-2">성도 검색</h1>
          <!-- 소속 검색 -->
          <div class="flex w-full items-center mx-auto text-sm mb-4">
            <div
              class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
            >
              <div class="flex flex-col w-full">
                <input
                  type="checkbox"
                  id="dropdownForGroup"
                  class="group-input hidden"
                  checked
                  on:change={(e) => {
                    if (e.target.checked) {
                      document
                        .getElementById("group-dropdown")
                        ?.classList.remove("hidden")

                      document
                        .getElementById("group-down")
                        ?.classList.add("hidden")
                      document
                        .getElementById("group-up")
                        ?.classList.remove("hidden")
                    } else {
                      const checkboxes = document.querySelectorAll(
                        "#group-dropdown input"
                      )
                      document
                        .getElementById("group-dropdown")
                        ?.classList.add("hidden")
                      document
                        .getElementById("group-down")
                        ?.classList.remove("hidden")
                      document
                        .getElementById("group-up")
                        ?.classList.add("hidden")
                      checkboxes.forEach((checkbox) => {
                        checkbox.checked = false
                      })
                    }
                  }}
                />
                <label
                  class="flex w-full justify-between p-2"
                  for="dropdownForGroup"
                >
                  <p class="select-none text-gray-400">소속</p>
                  <ChevronDown id="group-down" class="hidden cursor-pointer" />
                  <ChevronUp id="group-up" class="cursor-pointer" />
                </label>

                <div
                  id="group-dropdown"
                  class="flex justify-between text-gray-600 border-t border-gray-300 focus:outline-0 px-5 gap-3"
                >
                  <select
                    id="group1"
                    value={group1}
                    on:change={() => {
                      group1 = document.querySelector(
                        "#group1 > option:checked"
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
                      group2Add = ""
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
                    class:hidden={group1 == "장년부" && group2 != ""
                      ? false
                      : true}
                  />
                  <select
                    id="group2Add"
                    value={group2Add}
                    required
                    on:change={() => {
                      group2Add = document.querySelector("#group2Add").value
                    }}
                    class="flex bg-gray-50 text-gray-600 text-sm focus:outline-0 py-2"
                    class:hidden={group1 == "장년부" && group2 != ""
                      ? false
                      : true}
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

          <!-- 직분 검색 -->
          <div class="flex flex-col w-full justify-center items-center mb-4">
            <div class="flex w-full items-center mx-auto">
              <div
                class="flex w-full bg-gray-50 border-y border-x border-gray-300 focus:outline-0"
              >
                <div class="flex flex-col w-full">
                  <input
                    type="checkbox"
                    id="dropdownM"
                    checked
                    class="jikbunM-input hidden"
                    on:change={(e) => {
                      if (e.target.checked) {
                        document
                          .getElementById("jikbunM-dropdown")
                          ?.classList.remove("hidden")

                        document
                          .getElementById("jikbunM-down")
                          ?.classList.add("hidden")
                        document
                          .getElementById("jikbunM-up")
                          ?.classList.remove("hidden")
                      } else {
                        const checkboxes = document.querySelectorAll(
                          "#jikbunM-dropdown input"
                        )
                        document
                          .getElementById("jikbunM-dropdown")
                          ?.classList.add("hidden")
                        document
                          .getElementById("jikbunM-down")
                          ?.classList.remove("hidden")
                        document
                          .getElementById("jikbunM-up")
                          ?.classList.add("hidden")
                        checkboxes.forEach((checkbox) => {
                          checkbox.checked = false
                        })
                      }
                    }}
                  />
                  <label
                    class="flex w-full justify-between p-2"
                    for="dropdownM"
                  >
                    <p class="text-gray-400 text-sm select-none">직분</p>
                    <ChevronDown
                      id="jikbunM-down"
                      class="hidden cursor-pointer"
                    />
                    <ChevronUp id="jikbunM-up" class="cursor-pointer" />
                  </label>

                  <div
                    id="jikbunM-dropdown"
                    class="grid grid-cols-2 gap-[5px] border-t border-gray-300 focus:outline-0 px-3 py-2"
                  >
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="aM"
                        checked={jikbunArray.find(
                          (element) => element == "장로"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#aM").checked) {
                            jikbunArray = [...jikbunArray, "장로"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "장로"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="aM">장로</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="bM"
                        checked={jikbunArray.find(
                          (element) => element == "안수집사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#bM").checked) {
                            jikbunArray = [...jikbunArray, "안수집사"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "안수집사"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="bM">안수집사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="cM"
                        checked={jikbunArray.find(
                          (element) => element == "권사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#cM").checked) {
                            jikbunArray = [...jikbunArray, "권사"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "권사"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="cM">권사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="dM"
                        checked={jikbunArray.find(
                          (element) => element == "은퇴권사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#dM").checked) {
                            jikbunArray = [...jikbunArray, "은퇴권사"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "은퇴권사"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="dM">은퇴권사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="eM"
                        checked={jikbunArray.find(
                          (element) => element == "무임권사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#eM").checked) {
                            jikbunArray = [...jikbunArray, "무임권사"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "무임권사"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="eM">무임권사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="fM"
                        checked={jikbunArray.find(
                          (element) => element == "무임은퇴권사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#fM").checked) {
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
                      <label for="fM">무임은퇴권사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="gM"
                        checked={jikbunArray.find(
                          (element) => element == "서리집사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#gM").checked) {
                            jikbunArray = [...jikbunArray, "서리집사"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "서리집사"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="gM">서리집사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="hM"
                        checked={jikbunArray.find(
                          (element) => element == "은퇴집사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#hM").checked) {
                            jikbunArray = [...jikbunArray, "은퇴집사"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "은퇴집사"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="hM">은퇴집사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="iM"
                        checked={jikbunArray.find(
                          (element) => element == "무임집사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#iM").checked) {
                            jikbunArray = [...jikbunArray, "무임집사"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "무임집사"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="iM">무임집사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="jM"
                        checked={jikbunArray.find(
                          (element) => element == "무임은퇴집사"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#jM").checked) {
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
                      <label for="jM">무임은퇴집사</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="kM"
                        checked={jikbunArray.find(
                          (element) => element == "권찰"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#kM").checked) {
                            jikbunArray = [...jikbunArray, "권찰"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "권찰"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="kM">권찰</label>
                    </p>
                    <p class="flex text-gray-600 text-sm gap-2 px-3">
                      <input
                        type="checkbox"
                        id="lM"
                        checked={jikbunArray.find(
                          (element) => element == "성도"
                        ) != undefined}
                        on:change={() => {
                          if (document.querySelector("#lM").checked) {
                            jikbunArray = [...jikbunArray, "성도"]
                          } else {
                            jikbunArray = [
                              ...jikbunArray.filter(
                                (value) => value !== "성도"
                              ),
                            ]
                          }
                        }}
                      />
                      <label for="lM">성도</label>
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
                    id="birth-dropdownM"
                    type="checkbox"
                    class="hidden"
                    checked
                    on:change={(e) => {
                      if (e.target.checked) {
                        document
                          .getElementById("birthBoxM")
                          ?.classList.remove("hidden")

                        document
                          .getElementById("birth-downM")
                          ?.classList.add("hidden")
                        document
                          .getElementById("birth-upM")
                          ?.classList.remove("hidden")
                      } else {
                        const checkboxes =
                          document.querySelectorAll("#birthBoxM input")
                        document
                          .getElementById("birthBoxM")
                          ?.classList.add("hidden")
                        document
                          .getElementById("birth-downM")
                          ?.classList.remove("hidden")
                        document
                          .getElementById("birth-upM")
                          ?.classList.add("hidden")
                        checkboxes.forEach((checkbox) => {
                          checkbox.checked = false
                        })
                      }
                    }}
                  />
                  <label
                    class="flex w-full justify-between p-2"
                    for="birth-dropdownM"
                  >
                    <p class="select-none text-gray-400">생년월일</p>
                    <ChevronDown
                      id="birth-downM"
                      class="hidden cursor-pointer"
                    />
                    <ChevronUp id="birth-upM" class="cursor-pointer" />
                  </label>

                  <div
                    id="birthBoxM"
                    class="flex justify-between text-gray-600 border-t border-gray-300 focus:outline-0 px-5 py-2"
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
        </div>
        <div
          class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
        >
          <button
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              isSearchModalHidden = !isSearchModalHidden
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={async () => {
              await searchHandler()
              isSearchModalHidden = true
            }}
          >
            <Search scale={16} />
            <span>검색</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
