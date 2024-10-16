<script lang="ts">
  import type { ISeongdo } from "$lib/interfaces"
  import { getAgeFromBirth } from "$lib/utils"

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

    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <!-- <div
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
      {/each} -->
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
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
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        id="gender"
        class="flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
      >
        성별
      </button>
      {#each seongdos as item, index}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          <button>
            {item.gender || ""}
          </button>
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        id="enrolled"
        class="flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
      >
        등록일자
      </button>
      {#each seongdos as item, index}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          <button>
            {item.enrolled_at || ""}
          </button>
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        id="birthField"
        class="flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
      >
        생년월일
      </button>
      {#each seongdos as item}
        <div
          class="flex justify-center px-3 divide-b divide-x items-center h-10"
        >
          {item.birth || ""}
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        나이
      </button>
      {#each seongdos as item}
        <div
          class="flex px-3 divide-b divide-x justify-center items-center h-10"
        >
          {getAgeFromBirth(item.birth) || ""}
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        직분
      </button>
      {#each seongdos as item}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          {item.jikbun || ""}
        </div>
      {/each}
    </div>

    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <button
        class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        신급
      </button>
      {#each seongdos as item}
        <div class="flex px-3 divide-b divide-x items-center h-10">
          {item.singeup || ""}
        </div>
      {/each}
    </div>

    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        핸드폰
      </div>
      {#each seongdos as item}
        <div
          class="flex justify-center px-3 divide-b divide-x items-center h-10"
        >
          {item.phone || ""}
        </div>
      {/each}
    </div>

    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        소속1
      </div>
      {#each seongdos as item}
        <div
          class="flex justify-center px-3 divide-b divide-x items-center h-10"
        >
          {item.group1 || ""}
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col divide-y whitespace-nowrap border-l border-b border-t"
    >
      <div
        class="flex justify-center px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        소속2
      </div>
      {#each seongdos as item}
        <div
          class="flex justify-center px-3 divide-b divide-x items-center h-10"
        >
          {item.group2 || ""}
        </div>
      {/each}
    </div>
    <div
      class="w-10 overflow-x-hidden flex flex-col flex-auto divide-y border-l border-b border-t"
    >
      <div
        class="flex justify-center px-3 bg-[#D9D9D8] font-bold divide-b divide-x items-center h-10"
      >
        주소
      </div>
      {#each seongdos as item}
        <div class="flex px-3 items-center h-10 border-r">
          <p class="whitespace-nowrap truncate">
            {item.address || ""}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
