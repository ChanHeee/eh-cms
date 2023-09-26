<script lang="ts">
  import "../../app.postcss"
  import { page, currentUser } from "$lib"
  import NavBar from "../../components/NavBar.svelte"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"

  export let data
  $: page.set(data.path)
</script>

<NavBar />

<div class="flex h-[calc(100vh-60px)]">
  <slot class="bg-white" />
</div>
