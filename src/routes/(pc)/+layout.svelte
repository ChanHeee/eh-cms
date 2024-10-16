<script lang="ts">
  import Briefcase from "$lib/icon/Briefcase.svelte"
  import HamburgerMenu from "$lib/icon/HamburgerMenu.svelte"
  import GraduationCap from "$lib/icon/GraduationCap.svelte"
  import { enhance } from "$app/forms"
  import "../../app.postcss"
  import "@xyflow/svelte/dist/style.css"

  import UserMultiple from "carbon-icons-svelte/lib/UserMultiple.svelte"
  import Logout from "carbon-icons-svelte/lib/Logout.svelte"
  import { goto } from "$app/navigation"
  import toast, { Toaster } from "svelte-french-toast"
  import { AllowedGroupStore } from "$lib/store"

  export let data: {
    path: string
    allowedGroup: string[]
  }

  $: $AllowedGroupStore = data.allowedGroup
  $: path = data.path

  const tab = { seongdos: "seongdos", educations: "educations" }

  $: hideMenu = true
</script>

<Toaster />
<div class="flex flex-col h-[100dvh]">
  <nav
    class="flex w-full sm:px-16 items-center text-white bg-[#4C5153] border-b-[4px]"
    class:border-[#F46055]={path == "seongdos" ? true : false}
    class:border-[#FBA244]={path == "educations" ? true : false}
    class:border-[#41B8AF]={path == "simbangs" ? true : false}
  >
    <div class="flex w-full flex-col">
      <div class="flex justify-between items-center px-7 sm:px-0 items-center">
        <div class="nav_left flex">
          <p class="text-xl cursor-pointer mt-1.5 py-3 mr-20">
            <a href="/"><button>은혜교회</button></a>
          </p>
          <div class="hidden sm:flex text-sm">
            <a href="/seongdos">
              <button
                class="flex flex-col items-center px-4 pt-3 pb-1 gap-1 hover:bg-[#F46055]"
                class:bg-[#F46055]={path == "seongdos" ? true : false}
              >
                <UserMultiple size={20} />
                <p class="text-sm">성도관리</p>
              </button>
            </a>

            <a href="/educations">
              <button
                class="flex flex-col items-center px-4 pt-3 pb-1 gap-1 hover:bg-[#FBA244]"
                class:bg-[#FBA244]={path == "educations" ? true : false}
              >
                <GraduationCap color="#ffffff" width="20px" />
                <p class="text-sm">교육관리</p>
              </button>
            </a>
            <a href="/simbangs">
              <button
                class="flex flex-col items-center px-4 pt-3 pb-1 gap-1 hover:bg-[#41B8AF]"
                class:bg-[#41B8AF]={path == "simbangs" ? true : false}
              >
                <div class="flex items-center h-[20px]">
                  <Briefcase color="#ffffff" width="16px" />
                </div>
                <p class="text-sm">심방관리</p>
              </button>
            </a>
          </div>
        </div>
        <div class="nav_right">
          <button class="sm:hidden mt-1.5">
            <label for="hamburger">
              <HamburgerMenu width="24px" color="#ffffff" />
            </label>
            <input
              id="hamburger"
              type="checkbox"
              class="hidden"
              on:change={(e) => {
                hideMenu = !hideMenu
              }}
            />
          </button>
          <form
            class="hidden sm:block"
            method="post"
            action="/login?/logout"
            use:enhance
          >
            <button class="text-md mt-1.5"> 로그아웃 </button>
          </form>
        </div>
      </div>

      <div
        id="menu"
        class="flex-col sm:hidden bg-[#5C6163] text-md"
        class:hidden={hideMenu}
      >
        <button
          class="flex w-full items-center text-start px-4 py-2"
          class:bg-[#F46055]={path == "seongdos" ? true : false}
          on:click={() => {
            hideMenu = true
            goto("/seongdos")
          }}
        >
          <UserMultiple size={16} class="mr-1" />
          <p>성도관리</p>
        </button>
        <button
          class="flex w-full items-center text-start px-4 py-2"
          class:bg-[#FBA244]={path == "educations" ? true : false}
          on:click={() => {
            hideMenu = true
            goto("/educations")
          }}
        >
          <GraduationCap color="#ffffff" width="16px" classString="mr-1" />
          <p>교육관리</p>
        </button>

        <button
          class="flex w-full items-center text-start px-4 py-2"
          class:bg-[#41B8AF]={path == "simbangs" ? true : false}
          on:click={() => {
            hideMenu = true
            goto("/simbangs")
          }}
        >
          <Briefcase color="#ffffff" width="14px" classString="mr-1" />
          <p>심방관리</p>
        </button>

        <form class="" method="post" action="/login?/logout" use:enhance>
          <button class="flex w-full items-center text-start px-4 py-2">
            <Logout class="mr-1" />
            <p>로그아웃</p>
          </button>
        </form>
      </div>
    </div>
  </nav>

  <div class="flex h-screen overflow-scroll">
    <slot class="bg-white" />
  </div>
</div>
