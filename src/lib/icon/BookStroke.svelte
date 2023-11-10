<script lang="ts">
  export let width: string
  export let color: string
  export let classString: string = ""
</script>

<svg
  id="element"
  class={classString}
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  {width}
  stroke="#000000"
  ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
    id="SVGRepo_tracerCarrier"
    stroke-linecap="round"
    stroke-linejoin="round"
  /><g id="SVGRepo_iconCarrier"
    ><path
      id="colorElement"
      stroke={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4M8 3v9l3-3 3 3V3M8 3h6"
    /></g
  ></svg
>

<style>
  li:hover button #element #colorElement {
    stroke: #fba244;
  }
</style>
