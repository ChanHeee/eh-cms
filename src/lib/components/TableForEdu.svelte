<script lang="ts">
  import { goto } from "$app/navigation"
  import type { IEducation } from "$lib/interfaces"

  export let educations: IEducation[]
  export let type: "seongdo" | "education" = "education"
  export let status: "proceeding" | "terminated" = "proceeding"

  const getSlug = (name: string, semester: string, startDate: string) => {
    return `${name}-${semester}-${startDate}`
  }
</script>

<div class="flex text-sm border-l">
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    >
      교육 이름
    </div>
    {#each educations as item}
      <button
        class="flex justify-center px-2 items-center h-10"
        on:click={() => {
          goto(
            `/educations/${getSlug(item.name, item.semester, item.startDate)}`
          )
        }}
      >
        {item.name}
      </button>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    >
      학기
    </div>
    {#each educations as item}
      <div class="flex justify-center px-2 items-center h-10">
        {item.semester}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      강사
    </button>
    {#each educations as item}
      <div class="flex px-3 items-center h-10">
        {item.teacher}
      </div>
    {/each}
  </div>
  <div
    class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
  >
    {#if type == "seongdo"}
      <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 상태 </button>
      {#each educations as item}
        <div class="flex justify-center px-3 items-center h-10">
          {item.status == "proceeding" ? "수강 중" : "수료"}
        </div>
      {/each}
    {:else if type == "education"}
      <button
        class="flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
      >
        {status == "proceeding" ? "수강 인원" : "수료 인원"}
      </button>
      {#each educations as item}
        <div class="flex justify-center px-3 items-center h-10">
          {item.enrolledNum}
        </div>
      {/each}
    {/if}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      교육 요일
    </button>
    {#each educations as item}
      <div class="flex px-3 justify-center items-center h-10">
        {item.day}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      교육 시간
    </div>
    {#each educations as item}
      <div class="flex justify-center px-3 items-center h-10">
        {item.time}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      교육 장소
    </div>
    {#each educations as item}
      <div class="flex justify-center px-3 items-center h-10">
        {item.place}
      </div>
    {/each}
  </div>
  <div class="flex flex-col flex-auto border-r divide-y border-b">
    <button
      class="flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8] whitespace-nowrap"
    >
      교육 기간
    </button>

    {#each educations as item, index}
      <div class="flex px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {`${item.startDate} ~ ${item.endDate}`}
        </p>
      </div>
    {/each}
  </div>
</div>
