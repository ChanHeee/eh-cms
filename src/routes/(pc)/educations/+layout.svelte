<script lang="ts">
  import BookStroke from "./../../../lib/icon/BookStroke.svelte"

  import { AlignBoxMiddleCenter } from "carbon-icons-svelte"
  import { goto } from "$app/navigation"
  import EducationSideBarSearch from "$lib/components/EducationSideBarSearch.svelte"

  export let data: {
    className: string
  }

  $: className = data.className || "전체"
</script>

<aside
  class="hidden-if-modile flex flex-col items-center w-[5rem] bg-[#B0B1B0]"
  aria-label="Sidebar"
>
  <ul class="flex flex-col w-full text-sm whitespace-nowrap">
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={className == "전체" ? true : false}
    >
      <button
        class="py-3 flex w-full justify-center items-center font-medium"
        class:text-[#FBA244]={className == "전체" ? true : false}
        class:text-white={className != "전체" ? true : false}
        on:click={() => {
          goto(`/educations`)
        }}
      >
        <AlignBoxMiddleCenter size={16} class="mr-1" />
        <p class="text-sm">전체</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={className == "기초반" ? true : false}
    >
      <button
        class="py-4 w-full flex flex-col items-center text-white hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={className == "기초반" ? true : false}
        class:text-white={className != "기초반" ? true : false}
        on:click|preventDefault={() => {
          goto(`/educations?class=기초반`)
        }}
      >
        <!-- <Book size={20} class="mb-1" /> -->
        <BookStroke
          color={className == "기초반" ? "#FBA244" : "#FFFFFF"}
          width="20px"
          classString="mb-1"
        />
        <p>기초반</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={className == "열매반" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={className == "열매반" ? true : false}
        class:text-white={className != "열매반" ? true : false}
        on:click={() => {
          goto(`/educations?class=열매반`)
        }}
      >
        <!-- <Book size={20} class="mb-1" /> -->
        <BookStroke
          color={className == "열매반" ? "#FBA244" : "#FFFFFF"}
          width="20px"
          classString="mb-1"
        />
        <p>열매반</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={className == "청지기반" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={className == "청지기반" ? true : false}
        class:text-white={className != "청지기반" ? true : false}
        on:click={() => {
          goto(`/educations?class=청지기반`)
        }}
      >
        <!-- <Book size={20} class="mb-1" /> -->
        <BookStroke
          color={className == "청지기반" ? "#FBA244" : "#FFFFFF"}
          width="20px"
          classString="mb-1"
        />
        <p>청지기반</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={className == "새신자반" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={className == "새신자반" ? true : false}
        class:text-white={className != "새신자반" ? true : false}
        on:click={() => {
          goto(`/educations?class=새신자반`)
        }}
      >
        <!-- <Book size={20} class="mb-1" /> -->
        <BookStroke
          color={className == "새신자반" ? "#FBA244" : "#FFFFFF"}
          width="20px"
          classString="mb-1"
        />
        <p>새신자반</p>
      </button>
    </li>
  </ul>
</aside>
<EducationSideBarSearch />

<slot><!-- optional fallback --></slot>
