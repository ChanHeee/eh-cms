<script>
  import { goto } from "$app/navigation"
  import { TrashCan } from "carbon-icons-svelte"
  export let avatar
  export let name
  export let birth
  export let gender
  export let classString = ""
  export let deleteHandler
</script>

<div
  class={"w-[200px] min-w-[200px] h-[70px] flex rounded " + classString}
  class:bg-[#789fac]={gender == "M" ? true : false}
  class:bg-[#c48a92]={gender == "F" ? true : false}
  class:bg-[#d3d3d3]={gender == "" ? true : false}
>
  {#if avatar}
    <img
      alt=""
      src={avatar || "/avatar.png"}
      class="my-auto ml-[5px] rounded border-0 border w-[60px] min-w-[60px] h-[60px] object-cover"
    />
  {:else}
    <div
      class="my-auto ml-[5px] flex justify-center items-center w-[60px] min-w-[60px] h-[60px]"
    >
      <svg
        width={45}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style="fill: white"
        data-icon="person"
      >
        <g data-icon="person">
          <path
            d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 
    64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 
    0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z"
          ></path>
        </g>
      </svg>
    </div>
  {/if}

  <div class="flex w-full justify-between">
    <div class="flex flex-col w-full justify-center text-white ml-3 w-[95px]">
      <button
        class="flex truncate w-full"
        on:click={() => {
          goto(`/seongdos/${name}`)
        }}
        >{name}
      </button>
      <button class="flex w-full truncate">{birth}</button>
    </div>
    <button
      type="submit"
      class=""
      on:click={() => {
        deleteHandler()
      }}
    >
      <TrashCan size={20} class="mr-2 mb-7 text-white" />
    </button>
  </div>
</div>
