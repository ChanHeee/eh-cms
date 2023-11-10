<script lang="ts">
  export let width: string
  export let color: string
  export let classString: string = ""
</script>

<svg
  class={classString}
  {width}
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
    id="SVGRepo_tracerCarrier"
    stroke-linecap="round"
    stroke-linejoin="round"
  /><g id="SVGRepo_iconCarrier"
    ><path
      stroke={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M8 3v9l3-3 3 3V3M8 3h6m0 0h4a2 2 0 0 1 2 2v7m-1 4v3m0 3v-3m0 0h3m-3 0h-3"
    /></g
  ></svg
>
