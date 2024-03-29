<script lang="ts">
  import { goto } from "$app/navigation"
  import type { IPage, ISeongdo } from "$lib/interfaces"
  import { AllowedGroupStore, SeongdoDeleteIdsStore } from "$lib/store"
  import {
    getGroupString,
    getSearchParams,
    isAllowDeleteGroup,
    isAllowGroup,
  } from "$lib/utils"
  import { ArrowDown, ArrowUp, ArrowsVertical } from "carbon-icons-svelte"
  import toast from "svelte-french-toast"

  export let seongdos: ISeongdo[]
  export let page: IPage
  export let allowedGroup: string[]

  $: searchParams = page.requestParams
  $: order = page.requestParams.order
  $: now = page.requestPage
  $: min =
    now % 5 == 0 ? (parseInt(now / 5) - 1) * 5 + 1 : parseInt(now / 5) * 5 + 1
  $: last = page.totalPage
  $: pagination = [0, 1, 2, 3, 4]
    .filter((i) => min + i <= last)
    .map((i) => min + i)

  $: idsInfo = {}
  $: $SeongdoDeleteIdsStore = getIds()
  $: getIds = () => {
    let ids = []
    Object.keys(idsInfo).map((key) => {
      ids = [...ids, ...idsInfo[key].ids]
    })
    return ids
  }
</script>

<div class="overflow-scroll flex text-sm mb-7 border-l bg-white">
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    >
      <input
        type="checkbox"
        on:input={(e) => {
          if (e.target.checked) {
            idsInfo[page.requestPage] = { checkAll: true }
            if (!idsInfo[page.requestPage].ids) {
              idsInfo[page.requestPage].ids = []
            }

            seongdos.map((item) => {
              if (isAllowDeleteGroup(allowedGroup, item.group1, item.group2)) {
                idsInfo[page.requestPage].ids = [
                  ...idsInfo[page.requestPage].ids,
                  item._id,
                ]
              }
            })
          } else {
            idsInfo[page.requestPage] = { checkAll: false, ids: [] }
          }
        }}
        checked={idsInfo[page.requestPage]?.checkAll}
      />
    </div>
    {#each seongdos as item}
      <div class="flex justify-center px-2 items-center h-10">
        <input
          type="checkbox"
          on:input={(e) => {
            if (!isAllowDeleteGroup(allowedGroup, item.group1, item.group2)) {
              toast.error("담당 부서가 아닌 성도는 삭제할 수 없습니다.")
              e.target.checked = false
            } else {
              if (e.target.checked) {
                if (!idsInfo[page.requestPage]?.ids) {
                  idsInfo[page.requestPage] = {
                    ...idsInfo[page.requestPage],
                    ids: [],
                  }
                }
                idsInfo[page.requestPage].ids = [
                  ...idsInfo[page.requestPage].ids,
                  item._id,
                ]
              } else {
                idsInfo[page.requestPage].ids = idsInfo[
                  page.requestPage
                ].ids.filter((idItem) => idItem != item._id)
              }
            }
          }}
          checked={idsInfo[page.requestPage]?.ids.includes(item._id)}
        />
      </div>
    {/each}
  </div>
  <!-- <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
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
          `/seongdos${getSearchParams({
            deleteMany: true,
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

    {#each seongdos as item, index}
      <div class="flex px-3 items-center h-10">
        <button
          on:click={() => {
            if (!isAllowGroup($AllowedGroupStore, item.group1, item.group2)) {
              toast.error("접근할 수 없습니다.")
            } else {
              goto(`/seongdos/${item.name}`)
            }
          }}
        >
          {item.name}
        </button>
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
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
      class=" flex justify-between px-3 font-bold items-center h-10 hover:bg-[#B0B1B0]"
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
        const { order, take, ...rest } = searchParams
        let newOrder
        if (order == "birthAsc") {
          newOrder = "birthDesc"
        } else if (order == "birthDesc") {
          newOrder = ""
        } else {
          newOrder = "birthAsc"
        }

        goto(
          `/seongdos${getSearchParams({
            deleteMany: true,
            ...rest,
            order: newOrder,
            page: 1,
          })}`
        )
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
      class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
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
    <button
      class=" flex justify-center gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      핸드폰
    </button>
    {#each seongdos as item}
      <div class="flex px-3 justify-center items-center h-10">
        {item.phone}
      </div>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
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
  <div class="flex flex-col flex-auto border-r divide-y border-b">
    <div
      class=" flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10 whitespace-nowrap truncate"
    >
      주소
    </div>
    {#each seongdos as item}
      <div class="flex px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {item.address}
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
            `/seongdos${getSearchParams({
              deleteMany: true,
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
            `/seongdos${getSearchParams({
              deleteMany: true,
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
            `/seongdos${getSearchParams({
              deleteMany: true,
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
