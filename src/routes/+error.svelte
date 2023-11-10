<script lang="ts">
  import { onMount } from "svelte"
  import "../app.postcss"
  import { goto } from "$app/navigation"

  $: time = 5
  onMount(() => {
    setInterval(() => {
      time--
    }, 1000)
  })
</script>

<div class="flex h-[calc(100vh-60px)]">
  <div class="flex w-full items-center">
    <div
      class="bg-gray-100 w-full flex h-[calc(130vh)] items-center justify-center p-4"
    >
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded-md p-8">
          <img class="mx-auto h-20 w-auto mb-10" src="/eh-logo.png" alt="" />
          <h1 class="text-center">
            잘못된 접근입니다. <span class="text-red-600">{time}초 후</span> 메인페이지로
            이동합니다.
          </h1>
          <div class="mt-3 flex justify-center gap-4">
            <button
              class="flex h-fit items-center gap-1 text-white text-sm px-2 py-[0.4rem] bg-red-400"
              on:click={() => {
                goto("/seongdos")
              }}
            >
              홈으로
            </button>
            <button
              class="flex h-fit items-center gap-1 text-white text-sm px-2 py-[0.4rem] bg-red-400"
              on:click={() => {
                history.back()
              }}
            >
              이전페이지
            </button>
          </div>

          <meta http-equiv="refresh" content="5; url=/" />
        </div>
      </div>
    </div>
  </div>
</div>
