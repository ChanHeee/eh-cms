<script lang="ts">
  export let classString = ""
  export let onClick
  export let value: string

  $: showInput = false
</script>

<form
  class={"pl-1 pr-3 border-2 border-dashed border-[#789fac] w-[150px] min-w-[150px] h-[70px] flex rounded bg-[#f9fafb] " +
    classString}
  on:submit|preventDefault={onClick}
  on:mouseleave={(e) => {
    showInput = false
    value = ""
  }}
>
  <button>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style="fill: #789fac"
      data-icon="plus"
      width="32"
    >
      <g data-icon="plus">
        <circle r="12" cx="12" cy="12" style="fill: rgba(0,0,0,0)"></circle>

        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path>
      </g>
    </svg>
  </button>

  <div class="flex flex-col justify-center text-[#789fac] ml-1">
    <p
      class="truncate text-sm"
      on:focus={undefined}
      on:mouseover={(e) => {
        showInput = true
      }}
    >
      Add Son
    </p>
    {#if showInput}
      <input
        type="text"
        bind:value
        on:focus={() => (value = "")}
        class="rounded py-[1px] mt-1 w-[75px] pl-2 focus:outline-0 text-black text-sm border border-[#789fac]"
      />
    {/if}
  </div>
</form>
