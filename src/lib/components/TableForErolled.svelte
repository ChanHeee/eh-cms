<script lang="ts">
  import type { ISeongdo } from "$lib/interfaces"
  import { ArrowRight } from "carbon-icons-svelte"

  export let seongdos: ISeongdo[]
</script>

<div class="flex text-sm border-l">
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    >
      사진
    </div>
    {#each seongdos as item}
      <div class="flex justify-center px-2 items-center h-10">
        <img
          class="mx-auto object-cover w-8 h-8"
          src={item.avatar || "/avatar.png"}
          alt=""
        />
      </div>
    {/each}
  </div>
  <div
    class="flex flex-col flex-auto whitespace-nowrap border-r divide-y border-b"
  >
    <button
      id="nameField"
      class="flex justify-between bg-[#D9D9D8] px-3 font-bold items-center h-10"
    >
      이름
    </button>

    {#each seongdos as item, index}
      <div class="flex px-3 items-center h-10">
        <button>
          {item.name}
        </button>
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      직분
    </button>
    {#each seongdos as item}
      <div class="flex px-3 items-center h-10">
        {item.jikbun}
      </div>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    />
    {#each seongdos as item}
      <div class="flex px-3 items-center h-10">
        <ArrowRight />
      </div>
    {/each}
  </div>
</div>
