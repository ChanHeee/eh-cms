<script lang="ts">
  export let width: string
  export let color: string
  export let classString: string = ""
</script>

<!-- <svg
  class={classString}
  fill="none"
  stroke={color}
  {width}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
    id="SVGRepo_tracerCarrier"
    stroke-linecap="round"
    stroke-linejoin="round"
  /><g id="SVGRepo_iconCarrier">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </g></svg
> -->
<svg
  class={classString}
  stroke={color}
  {width}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
    id="SVGRepo_tracerCarrier"
    stroke-linecap="round"
    stroke-linejoin="round"
  /><g id="SVGRepo_iconCarrier">
    <path
      d="M22 9L12 4L2 9L12 14L22 9ZM22 9V15M19 10.5V16.5L12 20L5 16.5V10.5"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g></svg
>
