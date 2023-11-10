<script lang="ts">
  import { seongdoResponse } from "$lib/store"

  $: seongdos = $seongdoResponse.seongdos

  //icon

  //variable
</script>

<section class="mb-5 flex flex-col w-full select-none">
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

    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-2 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        사진
      </div>
      {#each seongdos as item}
        <div
          class="flex justify-center px-2 divide-b divide-x items-center h-10"
        >
          <img
            class="mx-auto object-cover w-8 h-8"
            src={item.avatar || "/avatar.png"}
            alt=""
          />
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col flex-auto divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10 hover:bg-[#B0B1B0]"
      >
        이름
      </button>
      {#each seongdos as item, index}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          <a href={`/seongdos/${item.name}`}>
            <button>
              {item.name}
            </button>
          </a>
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col flex-auto divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10 hover:bg-[#B0B1B0]"
      >
        직분
      </button>
      {#each seongdos as item}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          {item.jikbun}
        </div>
      {/each}
    </div>

    <div
      class="flex flex-col flex-none divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10 hover:bg-[#B0B1B0]"
      >
        나이
      </button>
      {#each seongdos as item}
        <div class="flex px-3 divide-b divide-x items-center h-10 border-r">
          {item.age ?? ""}
        </div>
      {/each}
    </div>
  </div>
</section>
