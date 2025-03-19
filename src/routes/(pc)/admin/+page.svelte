<script lang="ts">
  import SearchTable from "./SearchTable.svelte"
  import TableForCSV from "./TableForCSV.svelte"
  import Table from "./Table.svelte"
  import type { IFamily, IPage, ISeongdo } from "$lib/interfaces"
  import { goto, invalidateAll } from "$app/navigation"
  import toast from "svelte-french-toast"
  import { read, utils } from "xlsx"
  import { Close, Search, TrashCan } from "carbon-icons-svelte"
  import {
    AllowedGroupStore,
    SeongdoPageStore,
    SeongdosStore,
    target,
  } from "$lib/store"
  import { getGroupString, isAllowGroup } from "$lib/utils"
  import TableWithoutPage from "./TableWithoutPage.svelte"

  export let data: {
    action: String
    seongdos: ISeongdo[]
    page: IPage
  }

  let teachers: ISeongdo[] = []

  $: members = []
  $: teachers = teachers

  $: action = data.action
  $: seongdos = data.seongdos || []
  $: page = data.page
  let familyType: IFamily
  $: family = familyType

  $: input = undefined
  $: socheonName = ""
  $: socheonSeongdo = undefined

  $: searchName = ""

  var loadFile = async function (event) {
    input = event.target
    var file = input.files[0]

    const readFile = (file: File) =>
      new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => resolve(reader.result)

        reader.readAsArrayBuffer(file)
      })

    let csv = await readFile(file)

    const wb = read(csv)
    const sheet = wb.Sheets[wb.SheetNames[0]]

    csv = utils.sheet_to_json<ISeongdo>(wb.Sheets[wb.SheetNames[0]], {
      header: ["name"],
    })

    seongdos = csv.slice(1)
  }

  var loadFileForUpdateGyogu = async function (event) {
    input = event.target
    var file = input.files[0]

    const readFile = (file: File) =>
      new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => resolve(reader.result)

        reader.readAsArrayBuffer(file)
      })

    let csv = await readFile(file)

    const wb = read(csv)
    const sheet = wb.Sheets[wb.SheetNames[0]]

    csv = utils.sheet_to_json<ISeongdo>(wb.Sheets[wb.SheetNames[0]], {
      header: ["name", "group2"],
    })

    seongdos = csv.slice(1)
  }

  const searchHandler = async () => {
    const response = await fetch(
      `/api/seongdos?name=${searchName}&excludeETC=true&take=10`,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    if (response.ok) {
      const result = await response.json()
      $SeongdosStore = result.seongdos
      $SeongdoPageStore = result.page
      $SeongdoPageStore.requestParams.take = 10
    }
  }

  const addTeacherHandler = async (
    teacher: ISeongdo,
    classification: string
  ) => {
    let response = await fetch(`/api/v2/seongdos/addTeacher`, {
      method: "POST",
      body: JSON.stringify({
        group: $target,
        seongdoId: teacher._id,
        classification,
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        toast.success("추가되었습니다.")
        teachers = [
          ...teachers,
          {
            ...teacher,
            services: [
              {
                group1: "",
                group2: "",
                classification,
              },
            ],
          },
        ]
      }
      await invalidateAll()
    }
  }

  $: socheonId = -1

  const socheonCheckHandler = (index) => {
    socheonId = index
  }
</script>

<div
  id="content"
  class="flex flex-col px-6 sm:px-16 pb-15 flex w-full bg-white overflow-scroll"
>
  <div class="flex flex-col mb-3">
    <div
      class=" bg-white pt-8 bg-white sticky top-0 flex w-full justify-between pb-2"
    >
      {#if action == undefined}
        <p class="text-lg font-medium mr-1"></p>
      {:else if action == "graduate"}
        <div class="flex items-center">
          <p class="truncate text-lg font-medium mr-1">졸업자 부서 이동</p>
          {#if page}
            <p class="text-lg">
              {`(${page.requestParams.name} 졸업자 : ${page.totalSize}명)`}
            </p>
          {/if}
        </div>
        <div class="hidden lg:flex rounded ml-auto">
          <button
            class="flex h-[2rem] max-h-[2rem] items-center rounded-l-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
          >
            <span>부서 선택</span>
          </button>
          <select
            bind:value={$target}
            class="w-[10rem] h-[2rem] max-h-[2rem] bg-gray-50 text-gray-900 text-sm focus:outline-0 border mr-2 rounded-r-sm pl-1"
            on:change={async (e) => {
              goto(`/admin?action=${action}&name=${e.target.value}`)
            }}
          >
            <option value="영아부">영아부</option>
            <option value="유치부">유치부</option>
            <option value="유년부">유년부</option>
            <option value="초등부">초등부</option>
            <option value="중등부">중등부</option>
            <option value="고등부">고등부</option>
            <option value="2청년부">2청년부</option>
          </select>
          <button
            class="flex h-[2rem] max-h-[2rem] items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!$target) {
                return toast.error("부서를 선택해주세요.")
              } else if (!confirm("부서를 이동하시겠습니까?")) {
                return false
              }
              const response = await fetch(`/api/v2/admin/graduate`, {
                method: "POST",
                body: JSON.stringify({
                  name: page.requestParams.name,
                }),
                headers: {
                  "content-type": "application/json",
                },
              })

              if (response.ok) {
                toast.success("수정되었습니다.")
              }
            }}
          >
            <span>졸업 처리</span>
          </button>
        </div>
      {:else if action == "addTeacher"}
        <!-- <p class="truncate text-lg font-medium mr-1">교회학교 교사 관리</p>
        <div class="relative hidden lg:flex rounded ml-auto">
          <button
            class="flex h-[2rem] max-h-[2rem] mr-2 border items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:mouseover={() => {
              document
                .querySelector("#addTeacher-tooltip")
                ?.classList.remove("hidden")
            }}
            on:mouseleave={() => {
              document
                .querySelector("#addTeacher-tooltip")
                ?.classList.add("hidden")
            }}
            on:focus={null}
          >
            <span>❔</span>
            <span>파일 예시</span>
          </button>
          <div
            id="addTeacher-tooltip"
            class="hidden flex flex-col gap-2 absolute -left-[2.5rem] top-[6.8rem] z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-2 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
            role="tooltip"
          >
            <span
              class="absolute -top-[0.8px] left-[46%] -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-[135deg] bg-white"
            ></span>
            <img class="w-32" src="/image_addTeacher.png" alt="" />
          </div>
          <input
            id="example1"
            type="file"
            class="h-[2rem] max-h-[2rem] mr-2 bg-gray-50 block text-xs rounded-sm border truncate file:h-[2rem] file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            on:change={(e) => {
              loadFile(e)
            }}
          />
          <button
            class="flex w-fit h-[2rem] max-h-[2rem] items-center rounded-l-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
          >
            <span class="truncate">부서 선택</span>
          </button>
          <select
            value=""
            class="mr-2 w-[10rem] h-[2rem] max-h-[2rem] bg-gray-50 text-gray-900 text-sm focus:outline-0 border mr-2 rounded-r-sm pl-1"
            on:change={async (e) => {
              $target = e.target.value
            }}
          >
            <option value="영아부">영아부</option>
            <option value="유치부">유치부</option>
            <option value="유년부">유년부</option>
            <option value="초등부">초등부</option>
            <option value="중등부">중등부</option>
            <option value="고등부">고등부</option>
            <option value="1청년부">1청년부</option>
            <option value="2청년부">2청년부</option>
            <option value="은혜브릿지">은혜브릿지</option>
            <option value="늘푸른부">늘푸른부</option>
          </select>
          <button
            class="hidden md:flex h-[2rem] items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!input) {
                return toast.error("파일을 선택해주세요.")
              } else if (!$target) {
                return toast.error("부서를 선택해주세요.")
              } else if (!confirm("추가하시겠습니까?")) {
                return false
              }

              const response = await fetch(`/api/v2/admin/addTeacher`, {
                method: "POST",
                body: JSON.stringify({
                  name: $target,
                  seongdoNames: seongdos.map((item) => item.name),
                }),
                headers: {
                  "content-type": "application/json",
                },
              })

              if (response.ok) {
                toast.success("추가되었습니다.")
              }
            }}
          >
            <span class="truncate">추가</span>
          </button>
        </div> -->
        <div class="flex flex-col w-full">
          <div class="flex mb-3 pb-3">
            <p class="truncate text-lg font-medium mr-1">
              {$target
                ? `${$target} 교사 관리 (${teachers?.length}명)`
                : "교회학교 교사 관리"}
            </p>
            <div class="relative hidden lg:flex rounded ml-auto">
              <button
                class="flex w-fit h-[2rem] max-h-[2rem] items-center rounded-l-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
              >
                <span class="truncate">부서 선택</span>
              </button>
              <select
                value=""
                class="mr-2 w-[10rem] h-[2rem] max-h-[2rem] bg-gray-50 text-gray-900 text-sm focus:outline-0 border mr-2 rounded-r-sm pl-1"
                on:change={async (e) => {
                  $target = e.target.value

                  const group1 = ["1청년", "2청년"].includes($target)
                    ? "청년부"
                    : "교회학교"
                  const response = await fetch(
                    `/api/v2/seongdos/getTeachers?group1=${group1}&group2=${$target}`,
                    {
                      headers: {
                        "content-type": "application/json",
                      },
                    }
                  )

                  if (response.ok) {
                    teachers = (await response.json()).seongdos
                  }
                }}
              >
                <option value="영아부">영아부</option>
                <option value="유치부">유치부</option>
                <option value="유년부">유년부</option>
                <option value="초등부">초등부</option>
                <option value="중등부">중등부</option>
                <option value="고등부">고등부</option>
                <option value="1청년">1청년부</option>
                <option value="2청년">2청년부</option>
              </select>
            </div>
          </div>
          <div class="flex gap-10">
            <div
              class="w-3/5 flex max-h-[60vh] h-fit text-sm border-l overflow-y-scroll"
            >
              <div
                class="flex flex-col h-fit whitespace-nowrap divide-y border-r border-b"
              >
                <div
                  class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
                >
                  이름
                </div>
                {#if teachers?.length > 0}
                  {#each teachers as teacher}
                    <button
                      class="flex px-3 items-center h-10"
                      on:click={() => {
                        if (
                          !isAllowGroup(
                            $AllowedGroupStore,
                            teacher.group1,
                            teacher.group2
                          )
                        ) {
                          toast.error("접근할 수 없습니다.")
                        } else {
                          goto(
                            teacher.birth
                              ? `/seongdos/${teacher.name}-${teacher.birth}`
                              : `/seongdos/${teacher.name}`
                          )
                        }
                      }}
                    >
                      <div>
                        {teacher.name}
                      </div>
                    </button>
                  {/each}
                {/if}
              </div>

              <div
                class="flex flex-col h-fit whitespace-nowrap border-r divide-y border-b"
              >
                <button
                  class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
                >
                  구분
                </button>
                {#if teachers?.length > 0}
                  {#each teachers as teacher}
                    <div class="flex px-3 items-center h-10">
                      {teacher?.services[0].classification || ""}
                    </div>
                  {/each}
                {/if}
              </div>

              <div
                class="flex flex-col h-fit whitespace-nowrap border-r divide-y border-b"
              >
                <button
                  class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
                >
                  직분
                </button>
                {#if teachers?.length > 0}
                  {#each teachers as teacher}
                    <div class="flex px-3 items-center h-10">
                      {teacher?.jikbun || ""}
                    </div>
                  {/each}
                {/if}
              </div>

              <div
                class="flex flex-col h-fit flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
              >
                <button class=" px-3 font-bold h-10 bg-[#D9D9D8]">
                  생년월일
                </button>
                {#if teachers?.length > 0}
                  {#each teachers as teacher}
                    <div class="flex justify-center px-3 items-center h-10">
                      {teacher?.birth}
                    </div>
                  {/each}
                {/if}
              </div>

              <div
                class="flex flex-col h-fit flex-auto whitespace-nowrap divide-y border-b"
              >
                <div
                  class="flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
                >
                  소속
                </div>
                {#if teachers?.length > 0}
                  {#each teachers as teacher}
                    <div class="flex justify-center px-3 items-center h-10">
                      {getGroupString(teacher?.group1, teacher?.group2)}
                    </div>
                  {/each}
                {/if}
              </div>

              <div
                class="flex flex-col h-fit whitespace-nowrap border-r divide-y border-b"
              >
                <button
                  class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
                />
                {#if teachers?.length > 0}
                  {#each teachers as teacher}
                    <div class="flex items-center px-3 h-10">
                      <button
                        type="button"
                        class="flex items-center gap-1 rounded-sm text-white text-xs px-1 py-[0.4rem]"
                        on:click={async () => {
                          let response = await fetch(
                            `/api/v2/seongdos/removeTeacher`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({
                                seongdoId: teacher._id,
                                group: $target,
                              }),
                              headers: {
                                "content-type": "application/json",
                              },
                            }
                          )

                          if (response.ok) {
                            const result = await response.json()

                            if (result.success) {
                              teachers = teachers.filter(
                                (item) => item._id != teacher._id
                              )
                            }
                          }
                        }}
                      >
                        <TrashCan fill="#4a4a4a" size={20} />
                      </button>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
            <div class="w-2/5 flex flex-col text-sm overflow-scroll">
              <form class="flex w-full items-center mx-auto">
                <input
                  id="name"
                  type="text"
                  on:focus={() => {
                    searchName = ""
                  }}
                  bind:value={searchName}
                  class="w-full bg-gray-50 border-gray-300 border-y border-l text-gray-900 text-sm focus:outline-0 px-2 h-10"
                  placeholder="이름"
                />
                <button
                  class="bg-[#B0B1B0] px-2 h-10 border-gray-300 border-y border-r"
                  on:click|preventDefault={async () => {
                    if (!$target) {
                      return toast.error("부서를 선택해주세요.")
                    }
                    await searchHandler()
                  }}
                  ><Search size={20} class="text-gray-600" />
                </button>
              </form>

              {#if $SeongdosStore.length > 0}
                <SearchTable addHandler={addTeacherHandler} />
              {/if}
            </div>
          </div>
        </div>
      {:else if action == "addToBridge"}
        <p class="truncate text-lg font-medium mr-1">은혜브릿지 성도 추가</p>
        <div class="relative hidden lg:flex rounded ml-auto">
          <button
            class="flex h-[2rem] max-h-[2rem] mr-2 border items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:mouseover={() => {
              document
                .querySelector("#addTeacher-tooltip")
                ?.classList.remove("hidden")
            }}
            on:mouseleave={() => {
              document
                .querySelector("#addTeacher-tooltip")
                ?.classList.add("hidden")
            }}
            on:focus={null}
          >
            <span>❔</span>
            <span>파일 예시</span>
          </button>
          <div
            id="addTeacher-tooltip"
            class="hidden flex flex-col gap-2 absolute -left-[2.5rem] top-[6.8rem] z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-2 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
            role="tooltip"
          >
            <span
              class="absolute -top-[0.8px] left-[46%] -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-[135deg] bg-white"
            ></span>
            <img class="w-32" src="/image_addTeacher.png" alt="" />
          </div>
          <input
            id="example1"
            type="file"
            class="h-[2rem] max-h-[2rem] mr-2 bg-gray-50 block text-xs rounded-sm border truncate file:h-[2rem] file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            on:change={(e) => {
              loadFile(e)
            }}
          />

          <button
            class="flex h-[2rem] max-h-[2rem] items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!input) {
                return toast.error("파일을 선택해주세요.")
              } else if (!confirm("추가하시겠습니까?")) {
                return false
              }

              const response = await fetch(`/api/v2/admin/addToBridge`, {
                method: "POST",
                body: JSON.stringify({
                  seongdoNames: seongdos.map((item) => item.name),
                }),
                headers: {
                  "content-type": "application/json",
                },
              })

              if (response.ok) {
                toast.success("추가되었습니다.")
              }
            }}
          >
            <span class="truncate">추가</span>
          </button>
        </div>
      {:else if action == "addToNpr"}
        <p class="text-lg font-medium mr-1">늘푸른부 성도 추가</p>
        <div class="relative hidden lg:flex rounded ml-auto">
          <button
            class="flex h-[2rem] max-h-[2rem] mr-2 border items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:mouseover={() => {
              document
                .querySelector("#addTeacher-tooltip")
                ?.classList.remove("hidden")
            }}
            on:mouseleave={() => {
              document
                .querySelector("#addTeacher-tooltip")
                ?.classList.add("hidden")
            }}
            on:focus={null}
          >
            <span>❔</span>
            <span>파일 예시</span>
          </button>
          <div
            id="addTeacher-tooltip"
            class="hidden flex flex-col gap-2 absolute -left-[2.5rem] top-[6.8rem] z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-2 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
            role="tooltip"
          >
            <span
              class="absolute -top-[0.8px] left-[46%] -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-[135deg] bg-white"
            ></span>
            <img class="w-32" src="/image_addTeacher.png" alt="" />
          </div>
          <input
            id="example2"
            type="file"
            class="h-[2rem] max-h-[2rem] mr-2 bg-gray-50 block text-xs rounded-sm border truncate file:h-[2rem] file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            on:change={(e) => {
              loadFile(e)
            }}
          />

          <button
            class="flec h-[2rem] max-h-[2rem] items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!input) {
                return toast.error("파일을 선택해주세요.")
              } else if (!confirm("추가하시겠습니까?")) {
                return false
              }

              const response = await fetch(`/api/v2/admin/addToNpr`, {
                method: "POST",
                body: JSON.stringify({
                  seongdoNames: seongdos.map((item) => item.name),
                }),
                headers: {
                  "content-type": "application/json",
                },
              })

              if (response.ok) {
                toast.success("추가되었습니다.")
              }
            }}
          >
            <span class="truncate">추가</span>
          </button>
        </div>
      {:else if action == "updateGyogu"}
        <p class="truncate text-lg font-medium mr-1">장년부 교구 이동</p>

        <div class="hidden lg:flex relative rounded ml-auto">
          <button
            class="flex h-[2rem] max-h-[2rem] mr-2 border items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:mouseover={() => {
              document
                .querySelector("#updateGyogu-tooltip")
                ?.classList.remove("hidden")
            }}
            on:mouseleave={() => {
              document
                .querySelector("#updateGyogu-tooltip")
                ?.classList.add("hidden")
            }}
            on:focus={null}
          >
            <span>❔</span>
            <span>파일 예시</span>
          </button>
          <div
            id="updateGyogu-tooltip"
            class="hidden flex flex-col gap-2 absolute -left-[5.5rem] top-[7.5rem] z-20 ml-3 -translate-y-1/2 border border-gray-300 whitespace-nowrap rounded-md bg-white py-2 text-xs text-gray-800 font-medium transition-opacity duration-300 shadow-[-12px_0px_30px_-4px_rgba(16,24,40,0.08)]"
            role="tooltip"
          >
            <span
              class="absolute -top-[0.8px] left-[46%] -z-10 h-3 w-3 border-gray-300 border-b border-l -translate-y-1/2 rotate-[135deg] bg-white"
            ></span>
            <img class="w-56" src="/image_updateGyogu.png" alt="" />
            <li class="px-4">반점(,)으로 교구와 구역을 구분해주세요!</li>
          </div>
          <input
            id="example2"
            type="file"
            class="h-[2rem] max-h-[2rem] mr-2 bg-gray-50 block text-xs rounded-sm border truncate file:h-[2rem] file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            on:change={(e) => {
              loadFileForUpdateGyogu(e)
            }}
          />

          <button
            class="flex h-[2rem] max-h-[2rem] items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!input) {
                return toast.error("파일을 선택해주세요.")
              } else if (!confirm("이동하시겠습니까?")) {
                return false
              }

              const response = await fetch(`/api/v2/admin/updateGyogu`, {
                method: "POST",
                body: JSON.stringify({
                  names: seongdos.map((item) => item.name),
                  group2s: seongdos.map((item) => item.group2),
                }),
                headers: {
                  "content-type": "application/json",
                },
              })

              if (response.ok) {
                toast.success("이동되었습니다.")
              }
            }}
          >
            <span class="truncate">이동</span>
          </button>
        </div>
      {:else if action == "editSocheon"}
        <div class="flex items-center">
          <p class="truncate text-lg font-medium mr-1">소천자 관리</p>
        </div>
        <div class="hidden lg:flex rounded ml-auto items-center">
          <input
            type="text"
            placeholder="이름"
            bind:value={socheonName}
            class="pl-1 w-[10rem] h-[2rem] max-h-[2rem] bg-gray-50 text-gray-900 text-sm focus:outline-0 border rounded-l-sm pl-1"
          />
          <button
            class="flex h-[2rem] max-h-[2rem] items-center rounded-r-sm text-white mr-2 text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!socheonName) {
                return toast.error("이름을 입력해주세요.")
              }

              const response = await fetch(
                `/api/v2/admin/socheon/getSeongdoByName?name=${socheonName}`,
                {
                  method: "GET",
                  headers: {
                    "content-type": "application/json",
                  },
                }
              )

              if (response.ok) {
                const result = await response.json()

                if (result.seongdos.length < 1) {
                  return toast.error("일치하는 성도가 없습니다.")
                }
                seongdos = result.seongdos
              }
            }}
          >
            <span>검색</span>
          </button>

          <button
            class="flex h-[2rem] max-h-[2rem] items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (socheonId < 0) {
                return toast.error("성도를 선택해주세요.")
              }

              // 소천 그룹으로 이동
              let response = await fetch(`/api/seongdos`, {
                method: "PUT",
                body: JSON.stringify({
                  _id: seongdos[socheonId]._id,
                  name: `${seongdos[socheonId].name}†`,
                  group1: "기타",
                  group2: "소천",
                }),
                headers: {
                  "content-type": "application/json",
                },
              })

              //가족관계 있는지 확인
              response = await fetch(
                `/api/families?seongdoId=${seongdos[socheonId]._id}`,
                {
                  method: "GET",
                  headers: {
                    "content-type": "application/json",
                  },
                }
              )

              if (response.ok) {
                family = (await response.json()).family
              }

              if (family) {
                family.memberIds = family.memberIds?.filter(
                  (id) => id != seongdos[socheonId]._id
                )
                family.members = family.members?.filter(
                  (member) =>
                    member.isSeongdo == false ||
                    member.seongdo._id != seongdos[socheonId]._id
                )

                //가족관계에서 본인 제외
                response = await fetch(`/api/families/${family._id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    memberIds: family.memberIds,
                    members: family.members,
                    detail: family.detail,
                  }),
                  headers: {
                    "content-type": "application/json",
                  },
                })
              }

              toast.success("수정되었습니다.")
            }}
          >
            <span>이동</span>
          </button>
        </div>
      {:else}
        <!-- else content here -->
      {/if}
    </div>
  </div>
  {#if action == "graduate" && seongdos?.length > 0 && page != undefined}
    <Table {seongdos} {page} />
  {:else if action == "editSocheon" && seongdos?.length > 0}
    <TableWithoutPage {seongdos} handler={socheonCheckHandler} />
  {:else if (action == "addTeacher" || action == "addToBridge" || action == "addToNpr" || action == "updateGyogu") && seongdos?.length > 0}
    <TableForCSV {seongdos} />
  {:else}
    <!-- else content here -->
  {/if}
</div>
