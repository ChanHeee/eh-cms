<script lang="ts">
  import { goto } from "$app/navigation"
  import type { IEducation, IPage } from "$lib/interfaces"
  import { getEduSlug, getSearchParams } from "$lib/utils"
  import { ArrowDown, ArrowUp, ArrowsVertical } from "carbon-icons-svelte"

  export let educations: IEducation[]
  export let page: IPage

  $: searchParams = page.requestParams
  $: order = searchParams.order
  $: now = page.requestPage
  $: min =
    now % 5 == 0 ? (parseInt(now / 5) - 1) * 5 + 1 : parseInt(now / 5) * 5 + 1
  $: last = page.totalPage
  $: pagination = [0, 1, 2, 3, 4]
    .filter((i) => min + i <= last)
    .map((i) => min + i)
</script>

<div class="overflow-scroll flex text-sm mb-7 border-l bg-white">
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="nameField"
      class=" flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
      class:bg-[#B0B1B0]={order == "nameAsc" || order == "nameDesc"
        ? true
        : false}
      class:bg-[#D9D9D8]={order == "nameAsc" || order == "nameDesc"
        ? false
        : true}
      on:mouseover={(e) => {
        if (order != "nameAsc" && order != "nameDesc") {
          document.getElementById("nameDefault")?.classList.remove("invisible")
        }
      }}
      on:mouseleave={(e) => {
        if (order != "nameAsc" && order != "nameDesc") {
          document.getElementById("nameDefault")?.classList.add("invisible")
        }
      }}
      on:focus={null}
      on:click={() => {
        const { order } = searchParams
        let newOrder
        if (order == "nameAsc") {
          newOrder = "nameDesc"
        } else if (order == "nameDesc") {
          newOrder = ""
        } else {
          newOrder = "nameAsc"
        }

        goto(
          `/educations${getSearchParams({
            order: newOrder,
            page: 1,
          })}`
        )
      }}
    >
      교육 이름
      {#if order == "nameAsc"}
        <ArrowsVertical id="nameDefault" class="ml-3 hidden" />
        <ArrowUp id="nameAsc" class="ml-3 " />
        <ArrowDown id="nameDesc" class="ml-3 hidden " />
      {:else if order == "nameDesc"}
        <ArrowsVertical id="nameDefault" class="ml-3 hidden" />
        <ArrowUp id="nameAsc" class="ml-3 hidden" />
        <ArrowDown id="nameDesc" class="ml-3  " />
      {:else}
        <ArrowsVertical id="nameDefault" class="ml-3 invisible" />
        <ArrowUp id="nameAsc" class="ml-3 hidden" />
        <ArrowDown id="nameDesc" class="ml-3 hidden " />{/if}
    </button>
    {#each educations as item}
      <button
        class="flex px-3 items-center h-10"
        on:click={() => {
          goto(
            `/educations/detail/${getEduSlug(
              item.name,
              item.semester,
              item.startDate
            )}`
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
    <div
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      강사
    </div>
    {#each educations as item}
      <div class="flex px-3 items-center h-10">
        {item.teacher}
      </div>
    {/each}
  </div>
  <div
    class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
  >
    <div
      class="flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
    >
      수강 인원
    </div>
    {#each educations as item}
      <div class="flex justify-center px-3 items-center h-10">
        {item.enrolledNum}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      교육 요일
    </div>
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
      id="eduDateField"
      class=" flex px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
      class:bg-[#B0B1B0]={order == "startDateAsc" || order == "startDateDesc"
        ? true
        : false}
      class:bg-[#D9D9D8]={order == "startDateAsc" || order == "startDateDesc"
        ? false
        : true}
      on:mouseover={(e) => {
        if (order != "startDateAsc" && order != "startDateDesc") {
          document
            .getElementById("startDateDefault")
            ?.classList.remove("invisible")
        }
      }}
      on:mouseleave={(e) => {
        if (order != "startDateAsc" && order != "startDateDesc") {
          document
            .getElementById("startDateDefault")
            ?.classList.add("invisible")
        }
      }}
      on:focus={null}
      on:click={() => {
        const { order } = searchParams
        let newOrder
        if (order == "startDateAsc") {
          newOrder = "startDateDesc"
        } else if (order == "startDateDesc") {
          newOrder = ""
        } else {
          newOrder = "startDateAsc"
        }

        goto(
          `/educations${getSearchParams({
            order: newOrder,
            page: 1,
          })}`
        )
      }}
    >
      교육 기간
      {#if order == "startDateAsc"}
        <ArrowsVertical id="startDateDefault" class="ml-3 hidden" />
        <ArrowUp id="startDateAsc" class="ml-3 " />
        <ArrowDown id="startDateDesc" class="ml-3 hidden " />
      {:else if order == "startDateDesc"}
        <ArrowsVertical id="startDateDefault" class="ml-3 hidden" />
        <ArrowUp id="startDateAsc" class="ml-3 hidden" />
        <ArrowDown id="startDateDesc" class="ml-3  " />
      {:else}
        <ArrowsVertical id="startDateDefault" class="ml-3 invisible" />
        <ArrowUp id="startDateAsc" class="ml-3 hidden" />
        <ArrowDown id="startDateDesc" class="ml-3 hidden " />{/if}
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

{#if pagination.length > 0}
  <!-- content here -->

  <div class="w-fit mx-auto flex items-center mb-8">
    <button
      on:click={async () => {
        const arrayStart = pagination[0]

        if (now > 1) {
          goto(
            `/educations${getSearchParams({
              ...page.requestParams,
              page: arrayStart - 1,
            })}`
          )
        }
      }}
      class=" p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100"
    >
      <svg
        width="9"
        fill="currentColor"
        height="8"
        class=""
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"
        />
      </svg>
    </button>
    {#each pagination as item}
      <button
        class="px-4 py-2 border-t border-b border-r text-base text-gray-600"
        class:bg-gray-100={item == now}
        class:bg-white={item != now}
        on:click={() => {
          goto(
            `/educations${getSearchParams({
              ...page.requestParams,
              page: item,
            })}`
          )
        }}
      >
        {item}
      </button>
    {/each}

    <button
      on:click={async () => {
        const arrayEnd = pagination.slice(-1)[0]
        const next = arrayEnd < last ? arrayEnd + 1 : arrayEnd

        if (now != last) {
          goto(
            `/educations${getSearchParams({
              ...page.requestParams,
              page: next,
            })}`
          )
        }
      }}
      class="w-full p-4 border-t border-b border-r text-base rounded-r-xl text-gray-600 bg-white hover:bg-gray-100"
    >
      <svg
        width="9"
        fill="currentColor"
        height="8"
        class=""
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"
        />
      </svg>
    </button>
  </div>
{/if}
