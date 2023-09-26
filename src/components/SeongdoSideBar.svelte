<script>
  import { AlignBoxMiddleCenter, UserMultiple } from "carbon-icons-svelte"
</script>

<aside
  class="flex flex-col items-center w-[4.15%] overflow-y-auto bg-[#B0B1B0]"
  aria-label="Sidebar"
>
  <ul class="flex flex-col w-full text-sm whitespace-nowrap">
    <li class="hover:bg-[#D9D9D8] bg-[#D9D9D8] cursor-pointer">
      <div
        class="py-3 flex justify-center items-center text-[#F46055] hover:text-[#F46055] font-medium"
      >
        <AlignBoxMiddleCenter size={16} class="mr-1" />
        <p class="text-sm">전체</p>
      </div>
    </li>
    <li class="hover:bg-[#D9D9D8] cursor-pointer">
      <div
        class="py-4 flex flex-col items-center text-white hover:text-[#F46055] font-medium"
      >
        <UserMultiple size={20} class="mb-1" />
        <p>장년부</p>
      </div>
    </li>
    <li class="hover:bg-[#D9D9D8] cursor-pointer">
      <div
        class="py-4 flex flex-col items-center text-white hover:text-[#F46055] font-medium"
      >
        <UserMultiple size={20} class="mb-1" />
        <p>청년부</p>
      </div>
    </li>
    <li class="hover:bg-[#D9D9D8] cursor-pointer">
      <div
        class="py-4 flex flex-col items-center text-white hover:text-[#F46055] font-medium"
      >
        <UserMultiple size={20} class="mb-1" />
        <p>교회학교</p>
      </div>
    </li>
  </ul>
</aside>
