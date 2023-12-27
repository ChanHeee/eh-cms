<script lang="ts">
  import { goto } from "$app/navigation"
  import { getSeongdosSearchParams } from "$lib/utils"
  import { seongdoResponse, seongdoSearchParams } from "$lib/store"

  export let classString = ""
  const pageSize = 12
  const paginationLen = 5

  $: skip = $seongdoResponse.skip
  $: total = $seongdoResponse.total
  $: now = skip / pageSize + 1
  $: min =
    now % paginationLen == 0
      ? (Math.floor(now / paginationLen) - 1) * paginationLen + 1
      : Math.floor(now / paginationLen) * paginationLen + 1
  $: last = Math.ceil(total / pageSize)
  $: pages = getPages()

  $: getPages = () => {
    const result = []
    for (var i = 0; i < paginationLen; i++) {
      if (min + i > last) {
        break
      }
      result.push({
        index: min + i,
        skip: (min - 1 + i) * pageSize,
      })
    }
    return result
  }
</script>

<div class={"w-full " + classString}>
  <div class="w-fit mx-auto flex items-center">
    {#if total > 0}
      <button
        on:click={async () => {
          const { page: pageNum, ...rest } = $seongdoSearchParams
          const url = `/seongdos${getSeongdosSearchParams({
            page: pages[0].index - 1,
            ...rest,
          })}`
          goto(url)
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

      {#each pages as page, index}
        <button
          class="px-4 py-2 border-t border-b border-r text-base text-gray-600"
          class:bg-gray-100={index == now - min}
          class:bg-white={index != now - min}
          on:click={async () => {
            const { page: pageNum, ...rest } = $seongdoSearchParams
            const url = `/seongdos${getSeongdosSearchParams({
              page: page.index,
              ...rest,
            })}`
            goto(url)
          }}
        >
          {page.index}
        </button>
      {/each}

      <button
        on:click={async () => {
          if (now == last) {
            return
          }
          const { page: pageNum, ...rest } = $seongdoSearchParams
          const url = `/seongdos${getSeongdosSearchParams({
            page:
              min + paginationLen - 1 >= last
                ? pages.slice(-1)[0].index
                : pages.slice(-1)[0].index + 1,
            ...rest,
          })}`
          goto(url)
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
    {/if}
  </div>
</div>
