<script lang="ts">
  import type { IPage, ISeongdo, ISeongdoEduPopulate } from "$lib/interfaces"
  import {
    PageStore,
    SeongdoEduPageStore,
    SeongdoEdusStore,
    SeongdoPageStore,
    SeongdosStore,
  } from "$lib/store"
  import { getSearchParams } from "$lib/utils"

  import { AddLarge } from "carbon-icons-svelte"
  import toast from "svelte-french-toast"

  export let educationId: string

  $: seongdos = $SeongdosStore
  $: seongdoPage = $SeongdoPageStore

  $: take = seongdoPage.requestParams.take
  $: name = seongdoPage.requestParams.name
  $: now = seongdoPage.requestPage
  $: min =
    now % 5 == 0 ? (parseInt(now / 5) - 1) * 5 + 1 : parseInt(now / 5) * 5 + 1
  $: last = seongdoPage.totalPage
  $: pagination = [0, 1, 2, 3, 4]
    .filter((i) => min + i <= last)
    .map((i) => min + i)

  const searchHandler = async (pageInput: number) => {
    const response = await fetch(
      `/api/seongdos?name=${name}&page=${pageInput}&take=${take}`,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    if (response.ok) {
      const result = await response.json()

      seongdos = result.seongdos
      seongdoPage = result.page
    }
  }

  const isEnrolled = async (seongdoId: string, educationId: string) => {
    const response = await fetch(
      `/api/seongdoEdus?educationId=${educationId}&seongdoId=${seongdoId}`
    )
    if (response.ok) {
      const seongdoEdus = (await response.json()).seongdoEdus

      if (seongdoEdus.length == 0) {
        return false
      } else {
        return true
      }
    }
    return false
  }
  const enrollHandler = async (seongdo: ISeongdo, educationId: string) => {
    const response = await fetch("/api/seongdoEdus", {
      method: "POST",
      body: JSON.stringify({ seongdo: seongdo._id, education: educationId }),
      headers: {
        "content-type": "application/json",
      },
    })

    if (response.ok) {
      const result = await (
        await fetch(
          `/api/seongdoEdus${getSearchParams(
            $SeongdoEduPageStore.requestParams
          )}`,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
      ).json()
      $SeongdoEdusStore = result.seongdoEdus
      $SeongdoEduPageStore = result.page
      toast.success("추가 되었습니다.")
    }
  }
</script>

<div class="flex text-sm border-l mb-7 overflow-scroll">
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
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
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="nameField"
      class=" flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
    >
      이름
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
      class=" flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
    >
      생년월일
    </button>

    {#each seongdos as item, index}
      <div class="flex px-3 items-center h-10">
        {item.birth}
      </div>
    {/each}
  </div>
  <div class="flex flex-col flex-auto whitespace-nowrap divide-y border-b">
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
  <div
    class="flex flex-col flex-none whitespace-nowrap border-r divide-y border-b"
  >
    <button
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    />
    {#each seongdos as item, index}
      <div class="flex items-center px-3 h-10">
        <button
          type="button"
          class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
          on:click={async () => {
            if (await isEnrolled(item._id, educationId)) {
              toast.error("이미 등록된 성도입니다.")
            } else {
              await enrollHandler(item, educationId)
            }
          }}
        >
          <AddLarge fill="#4a4a4a" size={20} />
        </button>
      </div>
    {/each}
  </div>
</div>

{#if pagination.length > 0}
  <!-- content here -->

  <div class="w-fit mx-auto flex items-center mb-5">
    <button
      on:click={async () => {
        const arrayStart = pagination[0]
        if (arrayStart == 1) {
          if (now != 1) {
            await searchHandler(1)
          }
        } else {
          await searchHandler(arrayStart - 1)
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
          // seongdos = await searchHandler(item)
          await searchHandler(item)
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
          // seongdos = await searchHandler(next)
          await searchHandler(next)
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
