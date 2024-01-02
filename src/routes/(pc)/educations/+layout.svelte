<script lang="ts">
  import BookStroke from "./../../../lib/icon/BookStroke.svelte"

  import { AlignBoxMiddleCenter, Search } from "carbon-icons-svelte"
  import { goto } from "$app/navigation"
  import EducationSideBarSearch from "$lib/components/EducationSideBarSearch.svelte"
  import type { ISeongdoEduSearchParams } from "$lib/interfaces"
  import { getSearchParams } from "$lib/utils"

  export let data: {
    searchParams: ISeongdoEduSearchParams
    groupList: any
  }

  const nameData = data.searchParams.name

  $: searchParams = data.searchParams
  $: groupList = data.groupList
  $: name = nameData ?? ""
  $: className = searchParams.className || "전체"
  $: jikbunArray = searchParams.jikbun ?? []

  const searchHandler = () => {
    const params = getSearchParams({
      name,
      jikbun: jikbunArray,
    })

    // const url = params ? `/educations/전체/${params}` : "/educations"
    const url = `/educations/${className}/${params}`
    goto(url)
  }
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
          name = ""
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
          name = ""
          goto(`/educations/기초반`)
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
      class:bg-[#D9D9D8]={className == "성숙반" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={className == "성숙반" ? true : false}
        class:text-white={className != "성숙반" ? true : false}
        on:click={() => {
          name = ""
          goto(`/educations/성숙반`)
        }}
      >
        <!-- <Book size={20} class="mb-1" /> -->
        <BookStroke
          color={className == "성숙반" ? "#FBA244" : "#FFFFFF"}
          width="20px"
          classString="mb-1"
        />
        <p>성숙반</p>
      </button>
    </li>
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={className == "사명자반" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={className == "사명자반" ? true : false}
        class:text-white={className != "사명자반" ? true : false}
        on:click={() => {
          name = ""
          goto(`/educations/사명자반`)
        }}
      >
        <!-- <Book size={20} class="mb-1" /> -->
        <BookStroke
          color={className == "사명자반" ? "#FBA244" : "#FFFFFF"}
          width="20px"
          classString="mb-1"
        />
        <p>사명자반</p>
      </button>
    </li>

    <!--     
    <li
      class="hover:bg-[#D9D9D8] cursor-pointer"
      class:bg-[#D9D9D8]={className == "새신자반" ? true : false}
    >
      <button
        class="py-4 flex w-full flex-col items-center text-white hover:text-[#FBA244] font-medium"
        class:text-[#FBA244]={className == "새신자반" ? true : false}
        class:text-white={className != "새신자반" ? true : false}
        on:click={() => {
          name = ""
          goto(`/educations/새신자반`)
        }}
      >
        <BookStroke
          color={className == "새신자반" ? "#FBA244" : "#FFFFFF"}
          width="20px"
          classString="mb-1"
        />
        <p>새신자반</p>
      </button>
    </li> -->
  </ul>
</aside>
<EducationSideBarSearch {searchParams} {groupList} />

<slot><!-- optional fallback --></slot>
