<script lang="ts">
  import Table from "./Table.svelte"
  import type { IPage, ISeongdoEduPopulate } from "$lib/interfaces"
  import { goto } from "$app/navigation"
  import { ListBoxes, Search } from "carbon-icons-svelte"
  import { getSearchParams } from "$lib/utils"
  import toast from "svelte-french-toast"

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
      <p class="text-lg font-medium mr-1">{className} 수강 내역</p>
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
    <Table {seongdoEdus} {page} />
  </div>
</div>
