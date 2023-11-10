<script lang="ts">
  import SeongdoSideBarSearch from "$lib/components/SeongdoSideBarSearch.svelte"
  import SeongdoSideBarGroup from "$lib/components/SeongdoSideBarGroup.svelte"
  import type { IGroup, ISeongdoSearchParams } from "$lib/interfaces"
  import {
    AlignBoxMiddleCenter,
    UserFilled,
    UserMultiple,
  } from "carbon-icons-svelte"
  import { goto } from "$app/navigation"

  export let data: {
    searchParams: ISeongdoSearchParams
    groupTree: IGroup
  }

  $: searchParams = data.searchParams
  $: group1 = searchParams.group1 || "전체"
  $: groupTree = data.groupTree
</script>

<aside
  class="hidden-if-modile flex flex-col items-center w-[5rem] h-full overflow-y-auto bg-[#B0B1B0]"
  aria-label="Sidebar"
>
  <ul class="flex flex-col w-full text-sm whitespace-nowrap">
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={group1 == "전체" ? true : false}
    >
      <button
        class="py-3 flex w-full justify-center items-center font-medium"
        class:text-[#F46055]={group1 == "전체" ? true : false}
        class:text-white={group1 != "전체" ? true : false}
        on:click={() => {
          goto(`/seongdos`)
        }}
      >
        <AlignBoxMiddleCenter size={16} class="mr-1" />
        <p class="text-sm">전체</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={group1 == "장년부" ? true : false}
    >
      <button
        class="py-4 w-full flex flex-col items-center text-white hover:text-[#F46055] font-medium"
        class:text-[#F46055]={group1 == "장년부" ? true : false}
        class:text-white={group1 != "장년부" ? true : false}
        on:click={() => {
          goto(`/seongdos?group1=장년부`)
        }}
      >
        <UserMultiple size={20} class="mb-1" />
        <p>장년부</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={group1 == "청년부" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#F46055] font-medium"
        class:text-[#F46055]={group1 == "청년부" ? true : false}
        class:text-white={group1 != "청년부" ? true : false}
        on:click={() => {
          goto(`/seongdos?group1=청년부`)
        }}
      >
        <UserMultiple size={20} class="mb-1" />
        <p>청년부</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={group1 == "교회학교" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#F46055] font-medium"
        class:text-[#F46055]={group1 == "교회학교" ? true : false}
        class:text-white={group1 != "교회학교" ? true : false}
        on:click={() => {
          goto(`/seongdos?group1=교회학교`)
        }}
      >
        <UserMultiple size={20} class="mb-1" />
        <p>교회학교</p>
      </button>
    </li>
  </ul>
</aside>
{#if group1 == "전체"}
  <SeongdoSideBarSearch {searchParams} />
{:else if group1 == "장년부"}
  <SeongdoSideBarGroup {groupTree} {searchParams} />
{:else if group1 == "청년부"}
  <SeongdoSideBarGroup {groupTree} {searchParams} />
{:else if group1 == "교회학교"}
  <SeongdoSideBarGroup {groupTree} {searchParams} />
{/if}

<slot><!-- optional fallback --></slot>
