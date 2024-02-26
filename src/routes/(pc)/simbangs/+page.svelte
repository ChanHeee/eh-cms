<script lang="ts">
  import type { ISimbang, ISimbangPage } from "$lib/interfaces"
  import { Checkmark, Close, Document, TrashCan } from "carbon-icons-svelte"
  import Table from "./Table.svelte"
  import TableForSelect from "./TableForSelect.svelte"
  import { goto } from "$app/navigation"
  import toast from "svelte-french-toast"
  import { SeongdoDeleteIdsStore } from "$lib/store"
  import { utils, writeFile } from "xlsx"
  import { getGroupString, getSearchParams } from "$lib/utils"

  export let data: {
    simbangs: ISimbang[]
    page: ISimbangPage
    selectMany: boolean
  }

  $: simbangs = data.simbangs
  $: page = data.page
  $: selectMany = data.selectMany
  $: ids = $SeongdoDeleteIdsStore
</script>

<div
  id="content"
  class="flex flex-col px-6 sm:px-16 pb-15 flex w-full bg-white overflow-scroll"
>
  <div class="flex flex-col mb-3">
    <div
      class=" bg-white pt-8 bg-white sticky top-0 flex w-full justify-between pb-2"
    >
      <!-- <p class="text-lg font-medium mr-1">심방 내역</p> -->
      <div class="flex items-center">
        <p class="text-lg font-medium mr-1">심방 내역</p>
        <p class="text-lg">
          {`(${page.totalSize})`}
        </p>
      </div>

      <div class="rounded flex ml-auto gap-2">
        {#if selectMany}
          <button
            class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#41B8AF]"
            on:click={async () => {
              if (ids.length == 0) {
                toast.error("선택된 심방이 없습니다.")
              } else {
                const response = await fetch(
                  `/api/simbangs?ids=${JSON.stringify(ids)}`,
                  {
                    method: "GET",
                    headers: {
                      "content-type": "application/json",
                    },
                  }
                )
                let simbangs = await response.json()

                let simbangSheet
                simbangSheet = simbangs.map((item) => {
                  return {
                    이름: item.seongdoId.name,
                    직분: item.seongdoId.jikbun,
                    소속: getGroupString(
                      item.seongdoId?.group1,
                      item.seongdoId?.group2
                    ),
                    심방날짜: item.date,
                    심방자: item.simbangja,
                    동행자: item.companion,
                    말씀: item.bible,
                    찬송: item.hymn,
                    내용: item.detail,
                  }
                })
                const worksheet = utils.json_to_sheet(simbangSheet)
                const workbook = utils.book_new()
                utils.book_append_sheet(workbook, worksheet)
                writeFile(workbook, `심방내역.xlsx`)
              }
            }}
          >
            <Checkmark scale={16} />
            <span>저장</span>
          </button>

          <button
            type="button"
            class="flex h-fit items-center gap-1 rounded-sm text-xs px-2 py-[0.335rem] border-gray-300 border"
            on:click={async () => {
              selectMany = false
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#41B8AF]" />
              <p>닫기</p>
            </span>
          </button>
        {:else}
          <button
            class="hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#237334]"
            on:click={async () => {
              selectMany = true
            }}
          >
            <Document scale={16} />
            <span>엑셀로 내보내기</span>
          </button>
        {/if}
      </div>
    </div>

    {#if selectMany}
      <TableForSelect {simbangs} {page} />
    {:else}
      <Table {simbangs} {page} />
    {/if}
  </div>
</div>
