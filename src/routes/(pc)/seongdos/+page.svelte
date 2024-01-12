<script lang="ts">
  import TableForDelete from "./TableForDelete.svelte"
  import Table from "./Table.svelte"
  import type { IPage, ISeongdo } from "$lib/interfaces"
  import { utils, writeFile } from "xlsx"
  import {
    Close,
    Document,
    Search,
    TrashCan,
    UserFollow,
    UserMultiple,
  } from "carbon-icons-svelte"
  import { goto } from "$app/navigation"
  import { getSearchParams, isAllowDeleteGroup, isAllowGroup } from "$lib/utils"
  import { onMount } from "svelte"
  import toast from "svelte-french-toast"
  import { SeongdoDeleteIdsStore } from "$lib/store"

  export let data: {
    seongdos: ISeongdo[]
    page: IPage
    allowedGroup: string[]
    deleteMany: boolean
  }

  $: name = ""
  $: seongdos = data.seongdos
  $: page = data.page
  $: requestParams = page.requestParams

  $: allowedGroup = data.allowedGroup
  $: group1 = page.requestParams.group1
  $: group2 = page.requestParams.group2

  $: deleteMany = data.deleteMany
  $: ids = $SeongdoDeleteIdsStore

  const searchHandler = () => {
    const params = getSearchParams({
      page: 1,
      name,
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
  <form class="flex md:hidden w-full items-center mx-auto mt-8">
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
            }

            let seongdosForSheet
            seongdosForSheet = seongdos.map((item) => {
              return {
                이름: item.name,
                생년월일: item.birth,
                나이: item.age,
                성별: item.gender,
                직분: item.jikbun,
                신급: item.singeup,
                소속1: item.group1,
                소속2: item.group2,
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
              deleteMany = false
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
              deleteMany = true
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
      <!-- else content here -->
      <Table {seongdos} {page} />
    {/if}
    <!-- <Table />
    <Pagination classString="mb-8" /> -->
  </div>
</div>
