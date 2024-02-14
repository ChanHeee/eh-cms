<script lang="ts">
  import type { ISimbang, ISimbangPage } from "$lib/interfaces"
  import Table from "./Table.svelte"

  export let data: {
    simbangs: ISimbang[]
    page: ISimbangPage
  }

  $: simbangs = data.simbangs
  $: page = data.page
</script>

<div
  id="content"
  class="flex flex-col px-6 sm:px-16 pb-15 flex w-full bg-white overflow-scroll"
>
  <div class="flex flex-col mb-3">
    <div
      class=" bg-white pt-8 bg-white sticky top-0 flex w-full justify-between pb-2"
    >
      <p class="text-lg font-medium mr-1">심방 내역</p>
    </div>
    <!-- <TableForEdu {educations} /> -->
    <Table {simbangs} {page} />
  </div>
</div>
