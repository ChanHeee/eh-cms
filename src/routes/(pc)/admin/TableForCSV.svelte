<script lang="ts">
  import type { ISeongdo } from "$lib/interfaces"
  import { getAgeFromBirth, getGroupString } from "$lib/utils"

  //icon

  //variable
  export let seongdos: ISeongdo[]
</script>

<section class="mb-10 flex flex-col w-full mx-auto select-none overflow-scroll">
  <div class="flex divide-x text-sm">
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
      >
        번호
      </div>
      {#each seongdos as item, index}
        <div
          class="flex justify-center px-2 font-bold divide-b divide-x items-center h-10"
        >
          {index + 1}
        </div>
      {/each}
    </div>

    <div class="flex flex-col divide-y whitespace-nowrap border-b border-t">
      <button
        id="nameField"
        class="flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
      >
        이름
      </button>
      {#each seongdos as item, index}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          <button>
            {item.name}
          </button>
        </div>
      {/each}
    </div>

    <div
      class="w-10 overflow-x-hidden flex flex-col flex-auto divide-y border-l border-b border-t"
    >
      <div
        class="flex justify-center px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      ></div>
      {#each seongdos as item}
        <div class="flex px-3 items-center h-10 border-r">
          <p class="whitespace-nowrap truncate"></p>
        </div>
      {/each}
    </div>
  </div>
</section>
