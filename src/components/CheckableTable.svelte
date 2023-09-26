<script lang="ts">
  import Pagination from "./Pagination.svelte"
  import {
    checkedSeongdo,
    seongdoResponse,
    seongdoSearchBody,
    page,
  } from "$lib"

  //icon
  import ArrowsVertical from "carbon-icons-svelte/lib/ArrowsVertical.svelte"
  import { ArrowDown, ArrowUp } from "carbon-icons-svelte"

  //variable

  $: tableSort = "nameDefault"
  $: seongdos = $seongdoResponse.seongdos

  // $: checkedArray = {}

  const sortByName = async () => {
    if (tableSort == "nameAsc") {
      tableSort = "nameDesc"
    } else if (tableSort == "nameDesc") {
      tableSort = "nameDefault"
    } else {
      tableSort = "nameAsc"
    }

    let { name, jikbun } = $seongdoSearchBody
    const response = await fetch(`/api/seongdos/search`, {
      method: "POST",
      body: JSON.stringify({ name, jikbun, skip: 0, sort: tableSort }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      seongdoSearchBody.set({
        name,
        jikbun: $seongdoSearchBody.jikbun,
        skip: 0,
        sort: tableSort,
      })
      const { seongdos: userArray, total, take, skip } = await response.json()
      seongdoResponse.set({ seongdos: userArray, total, take, skip })
    }
  }

  const sortByBirth = async () => {
    if (tableSort == "birthAsc") {
      tableSort = "birthDesc"
    } else if (tableSort == "birthDesc") {
      tableSort = "birthDefault"
    } else {
      tableSort = "birthAsc"
    }

    let { name, jikbun } = $seongdoSearchBody
    const response = await fetch(`/api/seongdos/search`, {
      method: "POST",
      body: JSON.stringify({ name, jikbun, skip: 0, sort: tableSort }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      seongdoSearchBody.set({
        name,
        jikbun: $seongdoSearchBody.jikbun,
        skip: 0,
        sort: tableSort,
      })
      const { seongdos: userArray, total, take, skip } = await response.json()
      seongdoResponse.set({ seongdos: userArray, total, take, skip })
    }
  }
</script>

<section class="mb-7 flex flex-col w-full mx-auto select-none">
  <div class="flex divide-x text-sm">
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
      >
        <input
          id="checkAll"
          type="checkbox"
          on:change={(e) => {
            if (e.target.checked) {
              seongdos.map((seongdo) => {
                document.getElementById(seongdo.name).checked = true
                $checkedSeongdo[seongdo._id] = true
              })
            } else {
              seongdos.map((seongdo) => {
                document.getElementById(seongdo.name).checked = false
                $checkedSeongdo[seongdo._id] = false
              })
            }
          }}
        />
      </div>
      {#each seongdos as item, index}
        <div
          class="flex flex-none w-10 justify-center px-2 font-bold divide-b divide-x items-center h-10"
        >
          <input
            id={item.name}
            type="checkbox"
            checked={$checkedSeongdo[item._id]}
            on:change={() => {
              if (document.getElementById(item.name).checked) {
                $checkedSeongdo[item._id] = true
              } else {
                $checkedSeongdo[item._id] = false
              }
            }}
          />
        </div>
      {/each}
    </div>

    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-2 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        사진
      </div>
      {#each seongdos as item}
        <div
          class="flex justify-center px-2 divide-b divide-x items-center h-10"
        >
          <img
            class="mx-auto object-cover w-8 h-8"
            src={item.avatar || "/avatar.png"}
            alt=""
          />
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        id="nameField"
        class="flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
        class:bg-[#B0B1B0]={tableSort == "nameAsc" || tableSort == "nameDesc"
          ? true
          : false}
        class:bg-[#D9D9D8]={tableSort == "nameAsc" || tableSort == "nameDesc"
          ? false
          : true}
        on:mouseover={(e) => {
          if (tableSort != "nameAsc" && tableSort != "nameDesc") {
            document
              .getElementById("nameDefault")
              ?.classList.remove("invisible")
          }
        }}
        on:mouseleave={(e) => {
          if (tableSort != "nameAsc" && tableSort != "nameDesc") {
            document.getElementById("nameDefault")?.classList.add("invisible")
          }
        }}
        on:focus={null}
        on:click={sortByName}
      >
        이름

        {#if tableSort == "nameAsc"}
          <ArrowsVertical id="nameDefault" class="ml-3 hidden" />
          <ArrowUp id="nameAsc" class="ml-3 " />
          <ArrowDown id="nameDesc" class="ml-3 hidden " />
        {:else if tableSort == "nameDesc"}
          <ArrowsVertical id="nameDefault" class="ml-3 hidden" />
          <ArrowUp id="nameAsc" class="ml-3 hidden" />
          <ArrowDown id="nameDesc" class="ml-3  " />
        {:else}
          <ArrowsVertical id="nameDefault" class="ml-3 invisible" />
          <ArrowUp id="nameAsc" class="ml-3 hidden" />
          <ArrowDown id="nameDesc" class="ml-3 hidden " />{/if}
      </button>
      {#each seongdos as item, index}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          <button
            on:click={() => {
              const { _id, name, avatar, birth, jikbun, age, phone, address } =
                item

              page.set($page + "Detail")
            }}
          >
            {item.name}
          </button>
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10 hover:bg-[#B0B1B0]"
        on:mouseover={(e) => {
          document
            .getElementById("jikbunDefalut")
            ?.classList.remove("invisible")
        }}
        on:mouseleave={(e) => {
          document.getElementById("jikbunDefalut")?.classList.add("invisible")
        }}
        on:focus={null}
      >
        직분
        <ArrowsVertical id="jikbunDefalut" class="invisible" />
      </button>
      {#each seongdos as item}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          {item.jikbun}
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        id="birthField"
        class="flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
        class:bg-[#B0B1B0]={tableSort == "birthAsc" || tableSort == "birthDesc"
          ? true
          : false}
        class:bg-[#D9D9D8]={tableSort == "birthAsc" || tableSort == "birthDesc"
          ? false
          : true}
        on:mouseover={(e) => {
          if (tableSort != "birthAsc" && tableSort != "birthDesc") {
            document
              .getElementById("birthDefault")
              ?.classList.remove("invisible")
          }
        }}
        on:mouseleave={(e) => {
          if (tableSort != "birthAsc" && tableSort != "birthDesc") {
            document.getElementById("birthDefault")?.classList.add("invisible")
          }
        }}
        on:focus={null}
        on:click={sortByBirth}
      >
        생년월일

        {#if tableSort == "birthAsc"}
          <ArrowsVertical id="birthDefault" class="ml-3 hidden" />
          <ArrowUp id="birthAsc" class="ml-3 " />
          <ArrowDown id="birthDesc" class="ml-3 hidden " />
        {:else if tableSort == "birthDesc"}
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
        <div
          class="flex justify-center px-3 divide-b divide-x items-center h-10"
        >
          {item.birth}
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        나이
      </button>
      {#each seongdos as item}
        <div
          class="flex px-3 divide-b divide-x justify-center items-center h-10"
        >
          {item.age ?? ""}
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        핸드폰
      </div>
      {#each seongdos as item}
        <div
          class="flex justify-center px-3 divide-b divide-x items-center h-10"
        >
          {item.phone}
        </div>
      {/each}
    </div>
    <div
      class="w-10 overflow-x-hidden flex flex-col flex-auto divide-y border-l border-b border-t"
    >
      <div
        class="flex justify-center px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        주소
      </div>
      {#each seongdos as item}
        <div class="flex px-3 items-center h-10 border-r">
          <p class="whitespace-nowrap truncate">
            {item.address}
          </p>
        </div>
      {/each}
    </div>
  </div>

  <!-- <div class="pagination flex items-center justify-between mt-6">
    <a
      href="#"
      class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5 rtl:-scale-x-100"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
        />
      </svg>

      <span> previous </span>
    </a>

    <div class="items-center invisible md:flex gap-x-3">
      <a
        href="#"
        class="px-2 py-1 text-sm text-blue-500 rounded-md bg-blue-100/60">1</a
      >
      <a
        href="#"
        class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >2</a
      >
      <a
        href="#"
        class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >3</a
      >
      <a
        href="#"
        class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >...</a
      >
      <a
        href="#"
        class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >12</a
      >
      <a
        href="#"
        class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >13</a
      >
      <a
        href="#"
        class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >14</a
      >
    </div>

    <a
      href="#"
      class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <span> Next </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5 rtl:-scale-x-100"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
        />
      </svg>
    </a>
  </div> -->
</section>
