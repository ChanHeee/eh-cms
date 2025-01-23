<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import type { IPage, ISeongdoEduPopulate } from "$lib/interfaces"
  import {
    AllowedGroupStore,
    SeongdoEduPageStore,
    SeongdoEdusStore,
  } from "$lib/store"
  import { getGroupString, getSearchParams, isAllowGroup } from "$lib/utils"
  import { TrashCan } from "carbon-icons-svelte"
  import toast from "svelte-french-toast"

  export let allowedGroup: string[]

  $: seongdoEdus = $SeongdoEdusStore
  $: page = $SeongdoEduPageStore

  $: searchParams = page.requestParams
  $: order = page.requestParams.order
  $: now = page.requestPage
  $: min =
    now % 5 == 0 ? (parseInt(now / 5) - 1) * 5 + 1 : parseInt(now / 5) * 5 + 1
  $: last = page.totalPage
  $: pagination = [0, 1, 2, 3, 4]
    .filter((i) => min + i <= last)
    .map((i) => min + i)

  const deleteHandler = async (seongdoId: any, educationId: any) => {
    const response = await fetch("/api/seongdoEdus", {
      method: "DELETE",
      body: JSON.stringify({ seongdo: seongdoId, education: educationId }),
      headers: {
        "content-type": "application/json",
      },
    })
    return response.ok
  }

  const getEnrolledSeongdoHandler = async (page: number) => {
    const response = await fetch(
      `/api/seongdoEdus${getSearchParams({
        ...$SeongdoEduPageStore.requestParams,
        page,
      })}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    )
    if (response.ok) {
      const result = await response.json()
      $SeongdoEdusStore = result.seongdoEdus
      $SeongdoEduPageStore = result.page
    }
  }
</script>

<div class="overflow-scroll flex text-sm mb-7 border-l bg-white">
  <!-- <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    >
      사진
    </div>
    {#each seongdoEdus as item}
      <div class="flex justify-center items-center h-10">
        <img
          class="mx-auto object-cover w-8 h-8"
          src={item.seongdo?.avatarVercelBlob || "/avatar.png"}
          alt=""
        />
      </div>
    {/each}
  </div> -->
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div class=" flex px-3 bg-[#D9D9D8] font-bold items-center h-10">이름</div>

    {#each seongdoEdus as item, index}
      <div class="flex px-3 items-center h-10">
        <button
          on:click={() => {
            if (
              !isAllowGroup(
                $AllowedGroupStore,
                item.seongdo.group1,
                item.seongdo.group2
              )
            ) {
              toast.error("접근할 수 없습니다.")
            } else {
              goto(
                item.seongdo?.birth
                  ? `/seongdos/${item.seongdo?.name}-${item.seongdo?.birth}`
                  : `/seongdos/${item.seongdo?.name}`
              )
            }
          }}
        >
          {item.seongdo.name}
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
    {#each seongdoEdus as item}
      <div class="flex px-3 items-center h-10">
        {item.seongdo.jikbun}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex gap-2 px-3 justify-center bg-[#D9D9D8] font-bold items-center text-center h-10"
    >
      생년월일
    </div>
    {#each seongdoEdus as item}
      <div class="flex px-3 items-center h-10">
        {item.seongdo.birth}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      나이
    </div>
    {#each seongdoEdus as item}
      <div class="flex px-3 justify-center items-center h-10">
        {item.seongdo.age ?? ""}
      </div>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      핸드폰
    </div>
    {#each seongdoEdus as item}
      <div class="flex justify-center px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {item.seongdo.phone}
        </p>
      </div>
    {/each}
  </div>
  <div class="flex flex-col flex-auto whitespace-nowrap divide-y border-b">
    <div
      class=" flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      소속
    </div>
    {#each seongdoEdus as item}
      <div class="flex justify-center px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {getGroupString(item.seongdo.group1, item.seongdo.group2)}
        </p>
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    />
    {#each seongdoEdus as item, index}
      <div class="flex items-center px-3 h-10">
        {#if allowedGroup.includes("교육")}
          <button
            type="button"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              const result = await deleteHandler(
                item.seongdo._id,
                item.education
              )
              if (result) {
                await invalidateAll()
              }
            }}
          >
            <TrashCan fill="#4a4a4a" size={20} />
          </button>
        {/if}
      </div>
    {/each}
  </div>
</div>

{#if pagination.length > 0}
  <!-- content here -->

  <div class="flex items-center mb-8 justify-center">
    <button
      on:click={async () => {
        const arrayStart = pagination[0]

        if (now > 1) {
          await getEnrolledSeongdoHandler(arrayStart - 1)
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
        on:click={async () => {
          await getEnrolledSeongdoHandler(item)
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
          await getEnrolledSeongdoHandler(next)
        }
      }}
      class="p-4 border-t border-b border-r text-base rounded-r-xl text-gray-600 bg-white hover:bg-gray-100"
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
