<script lang="ts">
  import Table from "./Table.svelte"
  import BookPlusStroke from "./../../../lib/icon/BookPlusStroke.svelte"
  import TableForEdu from "./../../../lib/components/TableForEdu.svelte"
  import { goto } from "$app/navigation"
  import ListBoxes from "carbon-icons-svelte/lib/ListBoxes.svelte"
  import type { IEducation, IPage } from "$lib/interfaces"

  export let data: {
    educations: IEducation[]
    page: IPage
    allowedGroup: string[]
  }

  $: educations = data.educations
  $: page = data.page
  $: allowedGroup = data.allowedGroup
</script>

<div
  id="content"
  class="flex flex-col px-6 sm:px-16 pb-15 flex w-full bg-white overflow-scroll"
>
  <div class="flex flex-col mb-3">
    <div
      class=" bg-white pt-8 bg-white sticky top-0 flex w-full justify-between pb-2"
    >
      <p class="text-lg font-medium mr-1">강의 내역</p>
      <div class="rounded flex ml-auto gap-2">
        {#if allowedGroup.includes("교육")}
          <button
            class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
            on:click={() => {
              goto("/educations/add")
            }}
          >
            <BookPlusStroke color="#ffffff" width="16px" />
            <span>강의 생성</span>
          </button>
        {/if}

        <button
          class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
          on:click={() => {
            goto("/educations/전체")
          }}
        >
          <ListBoxes size={16} />
          <span>수강 내역</span>
        </button>
      </div>
    </div>
    <!-- <TableForEdu {educations} /> -->
    <Table {educations} {page} />
  </div>
</div>
