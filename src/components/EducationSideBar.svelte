<script>
  import {
    eduName,
    seongdoResponse,
    seongdoSearchBody,
    getSeongdos,
    page,
    jikbunList,
    searchName,
    checkedSeongdo,
  } from "$lib"
  import { Book } from "carbon-icons-svelte"
</script>

<aside
  class="flex flex-col items-center w-[4.15%] overflow-y-auto bg-[#B0B1B0]"
  aria-label="Sidebar"
>
  <ul class="flex flex-col w-full text-sm whitespace-nowrap">
    <button
      on:click={async () => {
        const {
          eduName: temp,
          name,
          sort,
          jikbun,
          ...rest
        } = $seongdoSearchBody
        const response = await getSeongdos({
          sort: "nameDefault",
          eduName: "기초반",
          jikbun: [],
          name: "",
          ...rest,
        })
        if (response.ok) {
          eduName.set("기초반")
          jikbunList.set([])
          page.set("education")
          checkedSeongdo.set({})
          searchName.set("")
          seongdoResponse.set(await response.json())
        }
      }}
      class="hover:bg-[#D9D9D8]"
      class:bg-[#D9D9D8]={$eduName == "기초반" ? true : false}
    >
      <div
        class="py-4 flex flex-col items-center hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={$eduName == "기초반" ? true : false}
        class:text-white={$eduName != "기초반" ? true : false}
      >
        <Book size={20} class="mb-1" />
        <p>기초반</p>
      </div>
    </button>
    <button
      on:click={async () => {
        const {
          eduName: temp,
          name,
          sort,
          jikbun,
          ...rest
        } = $seongdoSearchBody
        const response = await getSeongdos({
          sort: "nameDefault",
          eduName: "열매반",
          jikbun: [],
          name: "",
          ...rest,
        })
        if (response.ok) {
          eduName.set("열매반")
          jikbunList.set([])
          searchName.set("")
          checkedSeongdo.set({})
          page.set("education")
          seongdoResponse.set(await response.json())
        }
      }}
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={$eduName == "열매반" ? true : false}
    >
      <div
        class="py-4 flex flex-col items-center hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={$eduName == "열매반" ? true : false}
        class:text-white={$eduName != "열매반" ? true : false}
      >
        <Book size={20} class="mb-1" />
        <p>열매반</p>
      </div>
    </button>
    <button
      on:click={async () => {
        const {
          eduName: temp,
          name,
          sort,
          jikbun,
          ...rest
        } = $seongdoSearchBody
        const response = await getSeongdos({
          sort: "nameDefault",
          eduName: "청지기반",
          jikbun: [],
          name: "",
          ...rest,
        })
        if (response.ok) {
          eduName.set("청지기반")
          page.set("education")
          searchName.set("")
          jikbunList.set([])
          checkedSeongdo.set({})
          seongdoResponse.set(await response.json())
        }
      }}
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={$eduName == "청지기반" ? true : false}
    >
      <div
        class="py-4 flex flex-col items-center hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={$eduName == "청지기반" ? true : false}
        class:text-white={$eduName != "청지기반" ? true : false}
      >
        <Book size={20} class="mb-1" />
        <p>청지기반</p>
      </div>
    </button>
  </ul>
</aside>
