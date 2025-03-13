<script lang="ts">
  import { goto } from "$app/navigation"
  import type { ISeongdo } from "$lib/interfaces"

  import { getGroupString } from "$lib/utils"

  export let seongdos: ISeongdo[]
  export let handler: any

  let id: number
  $: id = id

  const getAddressString = (fullAddress: string) => {
    let address = fullAddress.split(",")[0] || ""
    let extraAddress = fullAddress.split(" (")[1]?.slice(0, -1) || ""
    let detailAddress = extraAddress
      ? fullAddress.split(",")[1]?.split("(")[0]?.slice(1, -1)
      : fullAddress.split(",")[1]?.split("(")[0]?.slice(1) || ""

    if (!address) {
      return detailAddress
    } else {
      return fullAddress
    }
  }
</script>

<div class="overflow-scroll flex text-sm mb-7 border-l bg-white">
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
    ></div>
    {#each seongdos as item, index}
      <div class="flex justify-center px-2 items-center h-10">
        <input
          type="checkbox"
          on:input={(e) => {
            if (e.target.checked) {
              id = index
              handler(index)
            }
          }}
          checked={index == id}
        />
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="nameField"
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      이름
    </button>

    {#each seongdos as item, index}
      <div class="flex px-3 items-center h-10">
        {item.name}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      직분
    </div>
    {#each seongdos as item}
      <div class="flex px-3 items-center h-10">
        {item.jikbun}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="birthField"
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      생년월일
    </button>
    {#each seongdos as item}
      <div class="flex justify-center px-3 items-center h-10">
        {item.birth}
      </div>
    {/each}
  </div>
  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="ageField"
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      나이
    </button>
    {#each seongdos as item}
      <div class="flex px-3 justify-center items-center h-10">
        {item.age ?? ""}
      </div>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <div
      class=" flex justify-center gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
    >
      핸드폰
    </div>
    {#each seongdos as item}
      <div class="flex px-3 justify-center items-center h-10">
        {item.phone}
      </div>
    {/each}
  </div>

  <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
    <button
      id="groupField"
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      소속
    </button>
    {#each seongdos as item}
      <div class="flex px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {getGroupString(item.group1, item.group2)}
        </p>
      </div>
    {/each}
  </div>

  <div class="flex flex-col flex-auto border-r divide-y border-b">
    <button
      id="addressField"
      class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
    >
      주소
    </button>
    {#each seongdos as item}
      <div class="flex px-3 items-center h-10">
        <p class="whitespace-nowrap truncate">
          {getAddressString(item.address)}
        </p>
      </div>
    {/each}
  </div>
</div>
