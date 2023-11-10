<script lang="ts">
  import DotFill from "./../icon/DotFill.svelte"
  import DotBorder from "./../icon/DotBorder.svelte"
  import { goto } from "$app/navigation"
  import type { IGroup, ISeongdoSearchParams } from "$lib/interfaces"
  import { UserFilled } from "carbon-icons-svelte"
  import { onMount } from "svelte"

  export let groupTree: IGroup
  export let searchParams: ISeongdoSearchParams
  $: group1 = searchParams.group1
  $: group2 = searchParams.group2
</script>

<aside
  class="hidden-if-modile flex flex-col w-[30rem] px-6 py-8 font-semilight text-gray-600 text-sm"
>
  <div class="ml-2 flex flex-col">
    <div class="flex items-center">
      {#if groupTree.name == group1 && group2 == null}
        <DotFill width="12px" fill="#636363" />
      {:else}
        <DotBorder width="12px" fill="#c4c4c4" />
      {/if}
      <UserFilled
        fill={groupTree.name == group1 && group2 == null
          ? "#636363"
          : "#c4c4c4"}
        size={16}
        class="mr-1"
      />
      <button
        class:font-bold={groupTree.name == group1 && group2 == null
          ? true
          : false}
        on:click={() => {
          goto(`/seongdos?group1=${groupTree.name}`)
        }}
      >
        {`${groupTree.name}(${groupTree.total})`}
      </button>
    </div>
    {#each groupTree.child as child}
      <div class="flex items-center mt-[10px] ml-3">
        {#if child.name == group2}
          <DotFill width="12px" fill="#636363" />
        {:else}
          <DotBorder width="12px" fill="#c4c4c4" />
        {/if}

        <UserFilled
          fill={child.name == group2 ? "#636363" : "#c4c4c4"}
          size={16}
          class="mr-1"
        />
        <button
          class:font-bold={child.name == group2 ? true : false}
          on:click={() => {
            goto(`/seongdos?group1=${groupTree.name}&group2=${child.name}`)
          }}
        >
          {`${child.name}(${child.total})`}</button
        >
      </div>
      <div class="flex flex-col">
        {#each child.child as secondChild}
          <div class="flex items-center mt-[7px] ml-6">
            {#if child.name + "," + secondChild.name == group2}
              <DotFill width="12px" fill="#636363" />
            {:else}
              <DotBorder width="12px" fill="#c4c4c4" />
            {/if}
            <UserFilled
              fill={child.name + "," + secondChild.name == group2
                ? "#636363"
                : "#c4c4c4"}
              size={16}
              class="mr-1"
            />
            <button
              class:font-bold={child.name + "," + secondChild.name == group2
                ? true
                : false}
              on:click={() => {
                goto(
                  `/seongdos?group1=${groupTree.name}&group2=${child.name},${secondChild.name}`
                )
              }}>{`${secondChild.name}(${secondChild.total})`}</button
            >
          </div>
        {/each}
      </div>
    {/each}
  </div>
</aside>
