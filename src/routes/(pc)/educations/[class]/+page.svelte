<script lang="ts">
  import Table from "./Table.svelte"
  import type { IPage, ISeongdoEduPopulate } from "$lib/interfaces"
  import { goto } from "$app/navigation"
  import { DocumentExport, ListBoxes, Search } from "carbon-icons-svelte"
  import { getGroupString, getSearchParams } from "$lib/utils"
  import toast from "svelte-french-toast"
  import { utils, writeFile } from "xlsx"

  export let data: {
    seongdoEdus: ISeongdoEduPopulate[]
    page: IPage
    allowedGroup: string[]
  }

  $: name = ""
  $: className = data.page.requestParams.className
  $: seongdoEdus = data.seongdoEdus
  $: page = data.page
  $: allowedGroup = data.allowedGroup

  const searchHandler = () => {
    const params = getSearchParams({
      name,
    })

    const url = `/educations/전체/${params}`
    goto(url)
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
        <p class="text-lg font-medium mr-1">{className} 수강 내역</p>
        <p class="text-lg">
          {`(${page.totalSize}명)`}
        </p>
      </div>
      <div class="rounded flex ml-auto gap-2">
        <button
          class="hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#237334]"
          on:click={async () => {
            let seongdoEdus
            let response = await await fetch(
              `/api/seongdoEdus?class=${className}&take=${100000}`,
              {
                method: "GET",
                headers: {
                  "content-type": "application/json",
                },
              }
            )
            if (response.ok) {
              seongdoEdus = (await response.json()).seongdoEdus
            }

            seongdoEdus = seongdoEdus.map((item) => {
              return {
                이름: item.seongdo.name,
                직분: item.seongdo.jikbun,
                생년월일: item.seongdo.birth,
                나이: item.seongdo.age,
                소속: getGroupString(item.seongdo.group1, item.seongdo.group2),
                "교육 이름": item.education.name,
                학기: item.education.semester,
                "교육 기간": `${item.education.startDate} ~ ${item.education.endDate}`,
              }
            })

            const worksheet = utils.json_to_sheet(seongdoEdus)
            const workbook = utils.book_new()
            utils.book_append_sheet(workbook, worksheet)
            writeFile(
              workbook,
              `${className}수강내역_${new Date().toISOString().substring(0, 10)}.xlsx`
            )
          }}
        >
          <DocumentExport scale={16} />
          <span>엑셀로 내보내기</span>
        </button>
        <button
          class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
          on:click={() => {
            if (
              !allowedGroup.includes("교육") &&
              !allowedGroup.includes("전체")
            ) {
              toast.error("접근할 수 없습니다.")
            } else {
              goto("/educations")
            }
          }}
        >
          <ListBoxes size={16} />
          <span>강의 내역</span>
        </button>
      </div>
    </div>
    <Table {seongdoEdus} {page} />
  </div>
</div>
