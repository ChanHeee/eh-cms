<script>
  import { enhance } from "$app/forms"
  import { goto } from "$app/navigation"

  import { onMount } from "svelte"

  $: name = ""
  $: password = ""

  let isMobile = false
  onMount(() => {
    isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
  })
</script>

<div class="w-full h-screen bg-gray-100 justify-center" class:hidden={false}>
  <!-- <header class="flex mx-auto h-[10rem] justify-center mb-8">
    <img class="mt-auto h-15" src="/eh-logo.png" alt="" />
  </header> -->
  <form
    method="post"
    action="?/login"
    use:enhance={() => {
      return async ({ result }) => {
        if (result.data.success) {
          goto("/")
        } else {
          alert("아이디 또는 비밀번호가 일치하지 않습니다.")
        }
      }
    }}
    class="mx-auto mt-32 sm:w-[460px] w-[90%] bg-white px-[28px] py-6 rounded-md shadow-md"
  >
    <img class="mx-auto mb-8 h-15" src="/eh-logo.png" alt="" />
    <input
      id="id"
      name="name"
      bind:value={name}
      type="text"
      placeholder="아이디"
      required
      class="placeholder:font-xl px-2 py-3 block w-full rounded-t-md border border-gray-300 border-b-white shadow-sm focus:border-[#3D54A6] focus:border-x focus:outline-none"
    />

    <input
      id="password"
      name="password"
      bind:value={password}
      placeholder="비밀번호"
      type="password"
      required
      class="px-2 py-3 block w-full mb-5 rounded-b-md border border-gray-300 shadow-sm focus:border-[#3D54A6] focus:outline-none"
    />

    <div>
      <button
        class="w-full h-[52px] justify-center items rounded-md border border-transparent bg-[#3D54A6] font-medium text-lg text-white shadow-sm focus:outline-none"
        >로그인
      </button>
    </div>
  </form>
  <!-- <div class="w-full max-w-md sm:p-0 p-8 pb-32">
    <div class="bg-white shadow-md rounded-md p-8">
      <img class="mx-auto h-20 w-auto mb-10" src="/eh-logo.png" alt="" />
      <form
        method="post"
        action="?/login"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.data.success) {
              goto("/")
            } else {
              alert("아이디 또는 비밀번호가 일치하지 않습니다.")
            }
          }
        }}
        class="space-y-6 mt-4"
      >
        <div>
          <label for="id" class="block text-sm font-medium text-gray-700"
            >ID
          </label>
          <div class="mt-1">
            <input
              id="id"
              name="name"
              bind:value={name}
              type="text"
              required
              class="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <div class="mt-1">
            <input
              id="password"
              name="password"
              bind:value={password}
              type="password"
              required
              class="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            class="flex w-full justify-center rounded-md border border-transparent bg-[#3D54A6] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >Sign In
          </button>
        </div>
      </form>
    </div>
  </div> -->
</div>

<!-- <div
  id="no-mobile"
  class={isMobile
    ? "flex fixed top-0 left-0 w-[100vw] h-screen justify-center items-center z-[99] bg-gray-50"
    : "hidden"}
>
  <div class="flex flex-col w-4/5 rounded-lg mb-32 bg-white drop-shadow p-3">
    <img class="mx-auto h-10 w-auto mb-5" src="/eh-logo.png" alt="" />
    <p class="text-center mb-3 text-sm">
      이 페이지는 모바일에서 접근할 수 없습니다.<br />PC로 접근해주세요.
    </p>
  </div>
</div> -->
