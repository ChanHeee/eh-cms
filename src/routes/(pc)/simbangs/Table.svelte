<script lang="ts">
  import { goto } from "$app/navigation"
  import type { ISimbang, ISimbangPage } from "$lib/interfaces"
  import { AllowedGroupStore } from "$lib/store"

  import {
    getGroupString,
    getSearchParams,
    isAllowGroup,
    textShortenWithEllipsis,
  } from "$lib/utils"
  import { ArrowDown, ArrowUp, ArrowsVertical } from "carbon-icons-svelte"
  import toast from "svelte-french-toast"

  export let simbangs: ISimbang[]
  export let page: ISimbangPage
  console.log(page)

  $: searchParams = page.requestParams
  $: order = page.requestParams.order
  $: now = page.requestPage

  $: min =
    now % 5 == 0 ? (parseInt(now / 5) - 1) * 5 + 1 : parseInt(now / 5) * 5 + 1
  $: last = page.totalPage
  $: pagination = [0, 1, 2, 3, 4]
    .filter((i) => min + i <= last)
    .map((i) => min + i)
</script>

<div class="overflow-scroll flex text-sm mb-7 border-l bg-white">
  <!-- <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    >
      사진
    </div>
    {#each simbangs as item}
      <div class="flex justify-center px-2 items-center h-10">
        <img
          class="mx-auto object-cover w-8 h-8"
          src={item.seongdoId?.avatar || "/avatar.png"}
          alt=""
        />
      </div>
    {/each}
  </div> -->
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
        const { order, take, ...rest } = searchParams
        let newOrder
        if (order == "nameAsc") {
          newOrder = "nameDesc"
        } else if (order == "nameDesc") {
          newOrder = ""
        } else {
          newOrder = "nameAsc"
        }

        goto(
          `/simbangs/${getSearchParams({
            ...rest,
            order: newOrder,
            page: 1,
          })}`
        )
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

    {#each simbangs as item, index}
      <div class="flex px-3 items-center h-10">
        <button
          on:click={() => {
            if (
              !isAllowGroup(
                $AllowedGroupStore,
                item.seongdoId?.group1,
                item.seongdoId?.group2
              )
            ) {
              toast.error("접근할 수 없습니다.")
            } else {
              goto(`/seongdos/${item.seongdoId?.name}?simbangId=${item._id}`)
            }
          }}
        >
          {item.seongdoId?.name}
        </button>
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      직분
    </div>
    {#each simbangs as item}
      <div class="flex px-3 items-center h-10">
        {item.seongdoId?.jikbun}
      </div>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="groupField"
      class=" flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
      class:bg-[#B0B1B0]={order == "groupAsc" || order == "groupDesc"
        ? true
        : false}
      class:bg-[#D9D9D8]={order == "groupAsc" || order == "groupDesc"
        ? false
        : true}
      on:mouseover={(e) => {
        if (order != "groupAsc" && order != "groupDesc") {
          document.getElementById("groupDefault")?.classList.remove("invisible")
        }
      }}
      on:mouseleave={(e) => {
        if (order != "groupAsc" && order != "groupDesc") {
          document.getElementById("groupDefault")?.classList.add("invisible")
        }
      }}
      on:focus={null}
      on:click={() => {
        const { order, take, ...rest } = searchParams
        let newOrder
        if (order == "groupAsc") {
          newOrder = "groupDesc"
        } else if (order == "groupDesc") {
          newOrder = ""
        } else {
          newOrder = "groupAsc"
        }
        goto(
          `/simbangs/${getSearchParams({
            ...rest,
            order: newOrder,
            page: 1,
          })}`
        )
      }}
    >
      소속
      {#if order == "groupAsc"}
        <ArrowsVertical id="groupDefault" class="ml-3 hidden" />
        <ArrowUp id="groupAsc" class="ml-3 " />
        <ArrowDown id="groupDesc" class="ml-3 hidden " />
      {:else if order == "groupDesc"}
        <ArrowsVertical id="groupDefault" class="ml-3 hidden" />
        <ArrowUp id="groupAsc" class="ml-3 hidden" />
        <ArrowDown id="groupDesc" class="ml-3  " />
      {:else}
        <ArrowsVertical id="groupDefault" class="ml-3 invisible" />
        <ArrowUp id="groupAsc" class="ml-3 hidden" />
        <ArrowDown id="groupDesc" class="ml-3 hidden " />
      {/if}
    </button>
    {#each simbangs as item}
      <button
        class="flex px-3 items-center h-10"
        on:click={() => {
          if (item.seongdoId?.group1) {
            goto(
              `/simbangs${getSearchParams({
                group1: item.seongdoId?.group1,
                group2: item.seongdoId?.group2,
              })}`
            )
          }
        }}
      >
        <p class="whitespace-nowrap truncate">
          {getGroupString(item.seongdoId?.group1, item.seongdoId?.group2)}
        </p>
      </button>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="simbangjaField"
      class=" flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
      class:bg-[#B0B1B0]={order == "dateAsc" || order == "dateDesc"
        ? true
        : false}
      class:bg-[#D9D9D8]={order == "dateAsc" || order == "dateDesc"
        ? false
        : true}
      on:mouseover={(e) => {
        if (order != "dateAsc" && order != "dateDesc") {
          document.getElementById("dateDefault")?.classList.remove("invisible")
        }
      }}
      on:mouseleave={(e) => {
        if (order != "dateAsc" && order != "dateDesc") {
          document.getElementById("dateDefault")?.classList.add("invisible")
        }
      }}
      on:focus={null}
      on:click={() => {
        const { order, take, ...rest } = searchParams
        let newOrder
        if (order == "dateAsc") {
          newOrder = "dateDesc"
        } else if (order == "dateDesc") {
          newOrder = ""
        } else {
          newOrder = "dateAsc"
        }
        goto(
          `/simbangs/${getSearchParams({
            ...rest,
            order: newOrder,
            page: 1,
          })}`
        )
      }}
    >
      심방 날짜
      {#if order == "dateAsc"}
        <ArrowsVertical id="dateDefault" class="ml-3 hidden" />
        <ArrowUp id="dateAsc" class="ml-3 " />
        <ArrowDown id="dateDesc" class="ml-3 hidden " />
      {:else if order == "dateDesc"}
        <ArrowsVertical id="dateDefault" class="ml-3 hidden" />
        <ArrowUp id="dateAsc" class="ml-3 hidden" />
        <ArrowDown id="dateDesc" class="ml-3  " />
      {:else}
        <ArrowsVertical id="dateDefault" class="ml-3 invisible" />
        <ArrowUp id="dateAsc" class="ml-3 hidden" />
        <ArrowDown id="dateDesc" class="ml-3 hidden " />
      {/if}
    </button>
    {#each simbangs as item}
      <button class="flex px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {item.date}
        </p>
      </button>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="simbangjaField"
      class=" flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
      class:bg-[#B0B1B0]={order == "simbangjaAsc" || order == "simbangjaDesc"
        ? true
        : false}
      class:bg-[#D9D9D8]={order == "simbangjaAsc" || order == "simbangjaDesc"
        ? false
        : true}
      on:mouseover={(e) => {
        if (order != "simbangjaAsc" && order != "simbangjaDesc") {
          document
            .getElementById("simbangjaDefault")
            ?.classList.remove("invisible")
        }
      }}
      on:mouseleave={(e) => {
        if (order != "simbangjaAsc" && order != "simbangjaDesc") {
          document
            .getElementById("simbangjaDefault")
            ?.classList.add("invisible")
        }
      }}
      on:focus={null}
      on:click={() => {
        const { order, take, ...rest } = searchParams
        let newOrder
        if (order == "simbangjaAsc") {
          newOrder = "simbangjaDesc"
        } else if (order == "simbangjaDesc") {
          newOrder = ""
        } else {
          newOrder = "simbangjaAsc"
        }
        goto(
          `/simbangs/${getSearchParams({
            ...rest,
            order: newOrder,
            page: 1,
          })}`
        )
      }}
    >
      심방자
      {#if order == "simbangjaAsc"}
        <ArrowsVertical id="simbangjaDefault" class="ml-3 hidden" />
        <ArrowUp id="simbangjaAsc" class="ml-3 " />
        <ArrowDown id="simbangjaDesc" class="ml-3 hidden " />
      {:else if order == "simbangjaDesc"}
        <ArrowsVertical id="simbangjaDefault" class="ml-3 hidden" />
        <ArrowUp id="simbangjaAsc" class="ml-3 hidden" />
        <ArrowDown id="simbangjaDesc" class="ml-3  " />
      {:else}
        <ArrowsVertical id="simbangjaDefault" class="ml-3 invisible" />
        <ArrowUp id="simbangjaAsc" class="ml-3 hidden" />
        <ArrowDown id="simbangjaDesc" class="ml-3 hidden " />
      {/if}
    </button>
    {#each simbangs as item}
      <button
        class="flex px-3 items-center h-10"
        on:click={() => {
          goto(`/simbangs?simbangja=["${item.simbangja}"]`)
        }}
      >
        <p class="whitespace-nowrap truncate">
          {item.simbangja}
        </p>
      </button>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      동행자
    </div>
    {#each simbangs as item}
      <div class="flex px-3 items-center h-10">
        {item.companion}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      말씀
    </div>
    {#each simbangs as item}
      <div class="flex px-3 items-center h-10">
        {item.bible}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      찬송
    </div>
    {#each simbangs as item}
      <div class="flex px-3 items-center h-10">
        {item.hymn}
      </div>
    {/each}
  </div>

  <div class="flex flex-col flex-auto border-r divide-y border-b">
    <div
      class=" flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10 whitespace-nowrap truncate"
    >
      내용
    </div>
    {#each simbangs as item}
      <div class="flex px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {#if isAllowGroup($AllowedGroupStore, item.seongdoId?.group1, item.seongdoId?.group2)}
            {textShortenWithEllipsis(item.detail, 50)}
          {/if}
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
          const { take, ...rest } = page.requestParams
          goto(
            `/simbangs/${getSearchParams({
              ...rest,
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
          const { take, ...rest } = page.requestParams
          goto(
            `/simbangs/${getSearchParams({
              ...rest,
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
          const { take, ...rest } = page.requestParams
          goto(
            `/simbangs/${getSearchParams({
              ...rest,
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
