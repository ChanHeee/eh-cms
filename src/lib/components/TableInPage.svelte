<script lang="ts">
  import type { ISeongdo } from "./../interfaces/index.ts"
  import { goto } from "$app/navigation"
  import { seongdoSearchParams } from "$lib/store"
  import { getSeongdosSearchParams } from "$lib/utils"
  import { ArrowDown, ArrowUp, ArrowsVertical } from "carbon-icons-svelte"

  export let seongdos: any
  export let classString = ""
  $: searchParams = $seongdoSearchParams
  $: order = "defalut"

  const getGroupString = (group1: any, group2: any) => {
    if (group1 == "장년부") {
      return (
        group1 + " > " + group2.split(",")[0] + " > " + group2.split(",")[1]
      )
    } else {
      return group1 + " > " + group2
    }
  }
</script>

<div class={"flex text-sm mb-7 border-l " + classString}>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    >
      사진
    </div>
    {#each seongdos as item}
      <div class="flex justify-center px-2 items-center h-10">
        <img
          class="mx-auto object-cover w-8 h-8"
          src={item.avatar || "/avatar.png"}
          alt=""
        />
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="nameField"
      class="flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
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
        let newOrder
        if (order == "nameAsc") {
          newOrder = "nameDesc"
        } else if (order == "nameDesc") {
          newOrder = ""
        } else {
          newOrder = "nameAsc"
        }
      }}
    >
      이름
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

    {#each seongdos as item, index}
      <div class="flex px-3 items-center h-10">
        <a href={`/seongdos/${item.name}`}>
          <button>
            {item.name}
          </button>
        </a>
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      직분
    </button>
    {#each seongdos as item}
      <div class="flex px-3 items-center h-10">
        {item.jikbun}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="birthField"
      class="flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
      class:bg-[#B0B1B0]={order == "birthAsc" || order == "birthDesc"
        ? true
        : false}
      class:bg-[#D9D9D8]={order == "birthAsc" || order == "birthDesc"
        ? false
        : true}
      on:mouseover={(e) => {
        if (order != "birthAsc" && order != "birthDesc") {
          document.getElementById("birthDefault")?.classList.remove("invisible")
        }
      }}
      on:mouseleave={(e) => {
        if (order != "birthAsc" && order != "birthDesc") {
          document.getElementById("birthDefault")?.classList.add("invisible")
        }
      }}
      on:focus={null}
      on:click={() => {
        const { order, page, ...rest } = searchParams
        let newOrder
        if (order == "birthAsc") {
          newOrder = "birthDesc"
        } else if (order == "birthDesc") {
          newOrder = ""
        } else {
          newOrder = "birthAsc"
        }
      }}
    >
      생년월일
      {#if order == "birthAsc"}
        <ArrowsVertical id="birthDefault" class="ml-3 hidden" />
        <ArrowUp id="birthAsc" class="ml-3 " />
        <ArrowDown id="birthDesc" class="ml-3 hidden " />
      {:else if order == "birthDesc"}
        <ArrowsVertical id="birthDefault" class="ml-3 hidden" />
        <ArrowUp id="birthAsc" class="ml-3 hidden" />
        <ArrowDown id="birthDesc" class="ml-3  " />
      {:else}
        <ArrowsVertical id="birthDefault" class="ml-3 invisible" />
        <ArrowUp id="birthAsc" class="ml-3 hidden" />
        <ArrowDown id="birthDesc" class="ml-3 hidden " />
      {/if}
    </button>
    {#each seongdos as item}
      <div class="flex justify-center px-3 items-center h-10">
        {item.birth}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      나이
    </button>
    {#each seongdos as item}
      <div class="flex px-3 justify-center items-center h-10">
        {item.age ?? ""}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      핸드폰
    </div>
    {#each seongdos as item}
      <div class="flex justify-center px-3 items-center h-10">
        {item.phone}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      소속
    </div>
    {#each seongdos as item}
      <div class="flex justify-center px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {getGroupString(item.group1, item.group2)}
        </p>
      </div>
    {/each}
  </div>
</div>
