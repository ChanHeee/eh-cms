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
</div>
