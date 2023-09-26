<script lang="ts">
  import { invalidate, invalidateAll } from "$app/navigation"
  import UserMultiple from "carbon-icons-svelte/lib/UserMultiple.svelte"
  import Book from "carbon-icons-svelte/lib/Book.svelte"
  import {
    eduName,
    getSeongdos,
    jikbunList,
    page,
    searchName,
    seongdoResponse,
    tab,
  } from "$lib"
</script>

<nav
  class="flex w-screen px-20 gap-[5.5rem] items-center text-white bg-[#4C5153] border-b-[4px]"
  class:border-[#F46055]={$tab == "seongdo" ? true : false}
  class:border-[#FBA244]={$tab == "education" ? true : false}
>
  <p class="text-xl cursor-pointer mt-2">
    <a href="/"
      ><button
        on:click={async () => {
          const response = await getSeongdos({})
          if (response.ok) {
            seongdoResponse.set(await response.json())
            jikbunList.set([])
            searchName.set("")
            page.set("seongdo")
          }
        }}>은혜교회</button
      ></a
    >
  </p>
  <div class="flex text-sm">
    <a href="/">
      <button
        on:click={async () => {
          const response = await getSeongdos({})
          if (response.ok) {
            seongdoResponse.set(await response.json())
            jikbunList.set([])
            searchName.set("")
            page.set("seongdo")
          }
        }}
        class="flex flex-col items-center px-4 pt-3 pb-1 gap-1 hover:bg-[#F46055]"
        class:bg-[#F46055]={$tab == "seongdo" ? true : false}
      >
        <UserMultiple size={20} />
        <p class="text-sm">성도관리</p>
      </button>
    </a>

    <a href="/education">
      <button
        on:click={async () => {
          const response = await getSeongdos({ eduName: "기초반" })
          if (response.ok) {
            seongdoResponse.set(await response.json())
            jikbunList.set([])
            eduName.set("기초반")
            searchName.set("")
            page.set("education")
          }
        }}
        class="flex flex-col items-center px-4 pt-3 pb-1 gap-1 hover:bg-[#FBA244]"
        class:bg-[#FBA244]={$tab == "education" ? true : false}
      >
        <Book size={20} />
        <p class="text-sm">교육관리</p>
      </button>
    </a>
    <button
      class="absolute my-auto right-12 top-5"
      on:click={() => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
        invalidateAll()
      }}>로그아웃</button
    >
  </div>
</nav>
