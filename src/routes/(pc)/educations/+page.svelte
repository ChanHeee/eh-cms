<script lang="ts">
  import BookPlusStroke from "./../../../lib/icon/BookPlusStroke.svelte"
  import TableForEdu from "./../../../lib/components/TableForEdu.svelte"
  import { goto } from "$app/navigation"
  import type { IEducationResponse } from "$lib/interfaces"

  export let data: {
    proceedingEdu: IEducationResponse
    recentEdu: IEducationResponse
  }

  $: proceedingEdu = data.proceedingEdu.educations
  $: recentEdu = data.recentEdu.educations
</script>

<div
  id="content"
  class="flex flex-col px-6 sm:px-16 pt-8 pb-15 flex w-full bg-white box-border"
>
  <div class="flex w-full justify-between mb-2">
    <p class="text-lg font-medium mr-1">진행중인 강의</p>
    <div class="rounded flex ml-auto gap-2">
      <button
        class="flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
        on:click={() => {
          goto("/educations/add")
        }}
      >
        <BookPlusStroke color="#ffffff" width="16px" />
        <span>강의 생성</span>
      </button>
    </div>
  </div>

  <div class="flex flex-col overflow-scroll">
    <TableForEdu educations={proceedingEdu} status="proceeding" />
  </div>

  <div class="flex w-full justify-between mt-10 mb-2">
    <p class="text-lg font-medium mr-1">최근 강의</p>
  </div>
  <div class="flex flex-col overflow-scroll">
    <TableForEdu educations={recentEdu} status="terminated" />
  </div>
</div>
