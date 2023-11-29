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
  ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
    id="SVGRepo_tracerCarrier"
    stroke-linecap="round"
    stroke-linejoin="round"
  ></g><g id="SVGRepo_iconCarrier"
    ><path
      stroke={color}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M21 12a9 9 0 1 0-9 9m0-14v3.764a2 2 0 0 0 1.106 1.789L16 14m3 2v3m0 3v-3m0 0h-3m3 0h3"
    ></path></g
  ></svg
>
