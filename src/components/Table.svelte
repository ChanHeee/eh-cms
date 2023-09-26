<script lang="ts">
  import {
    eduName,
    page,
    seongdoDetail,
    seongdoResponse,
    seongdoSearchBody,
    tab,
  } from "$lib"

  //icon
  import ArrowsVertical from "carbon-icons-svelte/lib/ArrowsVertical.svelte"
  import { ArrowDown, ArrowUp } from "carbon-icons-svelte"
  import { getSeongdos, getSeongdosNotInEdu } from "$lib/fetch"

  //variable

  $: seongdos = $seongdoResponse.seongdos
  $: sort = $seongdoSearchBody.sort
  $: fetchSeongdos = $page == "educationAdd" ? getSeongdosNotInEdu : getSeongdos

  const sortByName = async () => {
    let sortName
    if (sort == "nameAsc") {
      sortName = "nameDesc"
    } else if (sort == "nameDesc") {
      sortName = "nameDefault"
    } else {
      sortName = "nameAsc"
    }

    let { name, jikbun } = $seongdoSearchBody
    const response = await fetchSeongdos({
      name,
      jikbun,
      skip: 0,
      sort: sortName,
      eduName: $eduName,
    })
    if (response.ok) {
      seongdoResponse.set(await response.json())
    }
  }

  const sortByBirth = async () => {
    let sortName
    if (sort == "birthAsc") {
      sortName = "birthDesc"
    } else if (sort == "birthDesc") {
      sortName = "birthDefault"
    } else {
      sortName = "birthAsc"
    }

    let { name, jikbun } = $seongdoSearchBody
    const response = await fetchSeongdos({
      name,
      jikbun,
      skip: 0,
      sort: sortName,
      eduName: $eduName,
    })
    if (response.ok) {
      seongdoResponse.set(await response.json())
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
        번호
      </div>
      {#each seongdos as item, index}
        <div
          class="flex justify-center px-2 font-bold divide-b divide-x items-center h-10"
        >
          {index + 1}
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
        class:bg-[#B0B1B0]={sort == "nameAsc" || sort == "nameDesc"
          ? true
          : false}
        class:bg-[#D9D9D8]={sort == "nameAsc" || sort == "nameDesc"
          ? false
          : true}
        on:mouseover={(e) => {
          if (sort != "nameAsc" && sort != "nameDesc") {
            document
              .getElementById("nameDefault")
              ?.classList.remove("invisible")
          }
        }}
        on:mouseleave={(e) => {
          if (sort != "nameAsc" && sort != "nameDesc") {
            document.getElementById("nameDefault")?.classList.add("invisible")
          }
        }}
        on:focus={null}
        on:click={sortByName}
      >
        이름

        {#if sort == "nameAsc"}
          <ArrowsVertical id="nameDefault" class="ml-3 hidden" />
          <ArrowUp id="nameAsc" class="ml-3 " />
          <ArrowDown id="nameDesc" class="ml-3 hidden " />
        {:else if sort == "nameDesc"}
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
              page.set($page + "Detail")
              seongdoDetail.set(seongdos[index])
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
        class:bg-[#B0B1B0]={sort == "birthAsc" || sort == "birthDesc"
          ? true
          : false}
        class:bg-[#D9D9D8]={sort == "birthAsc" || sort == "birthDesc"
          ? false
          : true}
        on:mouseover={(e) => {
          if (sort != "birthAsc" && sort != "birthDesc") {
            document
              .getElementById("birthDefault")
              ?.classList.remove("invisible")
          }
        }}
        on:mouseleave={(e) => {
          if (sort != "birthAsc" && sort != "birthDesc") {
            document.getElementById("birthDefault")?.classList.add("invisible")
          }
        }}
        on:focus={null}
        on:click={sortByBirth}
      >
        생년월일

        {#if sort == "birthAsc"}
          <ArrowsVertical id="birthDefault" class="ml-3 hidden" />
          <ArrowUp id="birthAsc" class="ml-3 " />
          <ArrowDown id="birthDesc" class="ml-3 hidden " />
        {:else if sort == "birthDesc"}
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
</section>
