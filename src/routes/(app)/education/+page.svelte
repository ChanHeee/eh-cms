<script>
  import { tab, seongdoResponse, page, eduName } from "$lib"
  import Education from "../../../components/Education.svelte"
  import EducationAdd from "../../../components/EducationAdd.svelte"
  import EducationDetail from "../../../components/EducationDetail.svelte"

  export let data
  $: seongdos = data.seongdos
  $: total = data.total
  $: skip = data.skip
  $: take = data.take
  $: seongdoResponse.set({ seongdos, total, skip, take })
  $: tab.set(data.path)
  $: eduName.set("기초반")
</script>

<!-- <Seongdo /> -->

{#if $page == "education"}
  <Education />
{:else if $page == "educationDetail"}
  <EducationDetail />
{:else if $page == "educationAdd"}
  <EducationAdd />
{/if}
