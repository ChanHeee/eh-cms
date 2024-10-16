<script lang="ts">
  import { type NodeProps, Handle, Position, type Node } from "@xyflow/svelte"

  type $$Props = NodeProps

  export let data: any

  const { source, target } = data
</script>

<div class="w-[65px] h-[40px] bg-black invisible"></div>
{#if source}
  {#each source as item}
    <Handle type="source" position={item} id={item} />
  {/each}
{/if}

{#if target}
  {#each target as item}
    <Handle type="target" position={item} id={item} />
  {/each}
{/if}
