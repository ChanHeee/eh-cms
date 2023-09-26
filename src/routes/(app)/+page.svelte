<script>
  import { tab, seongdoResponse, page, eduName } from "$lib"
  import Education from "../../components/Education.svelte"
  import EducationAdd from "../../components/EducationAdd.svelte"
  import Seongdo from "../../components/Seongdo.svelte"
  import SeongdoAdd from "../../components/SeongdoAdd.svelte"
  import SeongdoAddMulti from "../../components/SeongdoAddMulti.svelte"
  import SeongdoDetail from "../../components/SeongdoDetail.svelte"

  export let data
  $: seongdos = data.seongdos
  $: total = data.total
  $: skip = data.skip
  $: take = data.take
  $: seongdoResponse.set({ seongdos, total, skip, take })
  $: tab.set(data.path)
  $: eduName.set("")
</script>

<!-- <Seongdo /> -->

{#if $page == "seongdo"}
  <Seongdo />
{:else if $page == "seongdoDetail"}
  <SeongdoDetail />
{:else if $page == "seongdoAdd"}
  <SeongdoAdd />
{:else if $page == "seongdoAddMulti"}
  <SeongdoAddMulti />
{/if}
