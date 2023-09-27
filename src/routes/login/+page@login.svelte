<script>
  import { goto } from "$app/navigation"
  import { currentUser } from "$lib"
  import { onMount, beforeUpdate } from "svelte"

  $: name = ""
  $: password = ""

  let isMobile = false
  onMount(() => {
    isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
  })

  const loginHandler = async () => {
    const response = await fetch(`/api/users/login`, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      const { token } = await response.json()
      document.cookie = `token = ${token}`
      currentUser.set({ user: { name } })
      goto("/")
    }
  }
</script>

<div class="flex w-full items-center" class:hidden={isMobile}>
  <div
    class="bg-gray-100 w-full flex h-[calc(130vh)] items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-white shadow-md rounded-md p-8">
        <img class="mx-auto h-20 w-auto mb-10" src="/eh-logo.png" alt="" />

        <form class="space-y-6 mt-4">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700">Email</label
            >
            <div class="mt-1">
              <input
                bind:value={name}
                type="text"
                required
                class="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700">Password</label
            >
            <div class="mt-1">
              <input
                bind:value={password}
                id="password"
                type="password"
                required
                class="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              on:click={loginHandler}
              class="flex w-full justify-center rounded-md border border-transparent bg-[#3D54A6] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              >Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<div
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
</div>
