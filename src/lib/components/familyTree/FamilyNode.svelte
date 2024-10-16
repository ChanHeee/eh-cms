<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte"

  type $$Props = NodeProps

  export let data: any

  const { label, source, target } = data
</script>

<div
  class="flex justify-center items-center w-[50px] h-[40px] border-[1px] border-black rounded text-xs"
>
  {label}
</div>
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
