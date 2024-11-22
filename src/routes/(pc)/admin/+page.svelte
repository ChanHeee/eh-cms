<script lang="ts">
  import TableForCSV from "./TableForCSV.svelte"
  import Table from "./Table.svelte"
  import type { IPage, ISeongdo } from "$lib/interfaces"
  import { goto } from "$app/navigation"
  import toast from "svelte-french-toast"
  import { read, utils } from "xlsx"

  export let data: {
    action: String
    seongdos: ISeongdo[]
    page: IPage
  }

  $: action = data.action
  $: seongdos = data.seongdos
  $: page = data.page

  $: targetName = ""
  $: input = undefined

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
          <p class="text-lg font-medium mr-1">졸업자 부서 이동</p>
          {#if page}
            <p class="text-lg">
              {`(${page.requestParams.name} 졸업자 : ${page.totalSize}명)`}
            </p>
          {/if}
        </div>
        <div class="rounded flex ml-auto">
          <button
            class="flex h-fit items-center rounded-l-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
          >
            <span>부서 선택</span>
          </button>
          <select
            value={page?.requestParams.name || ""}
            class="w-[10rem] bg-gray-50 text-gray-900 text-sm focus:outline-0 border mr-2 rounded-r-sm pl-1"
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
            class="flex h-fit items-center rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!targetName) {
                return alert("부서를 선택해주세요.")
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
        <p class="text-lg font-medium mr-1">교회학교 교사 추가</p>
        <div class="rounded flex ml-auto">
          <input
            id="example1"
            type="file"
            class="mr-2 bg-gray-50 block text-xs rounded-sm border truncate max-h-fit file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            on:change={(e) => {
              loadFile(e)
            }}
          />
          <button
            class="flex h-fit items-center rounded-l-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
          >
            <span>부서 선택</span>
          </button>
          <select
            value=""
            class="mr-2 w-[10rem] bg-gray-50 text-gray-900 text-sm focus:outline-0 border mr-2 rounded-r-sm pl-1"
            on:change={async (e) => {
              targetName = e.target.value
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
            class="hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!input) {
                return alert("파일을 선택해주세요.")
              } else if (!targetName) {
                return alert("부서를 선택해주세요.")
              } else if (!confirm("추가하시겠습니까?")) {
                return false
              }

              const response = await fetch(`/api/v2/admin/addTeacher`, {
                method: "POST",
                body: JSON.stringify({
                  name: targetName,
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
            <span>추가</span>
          </button>
        </div>
      {:else if action == "addToBridge"}
        <p class="text-lg font-medium mr-1">은혜브릿지 성도 추가</p>
        <div class="rounded flex ml-auto">
          <input
            id="example1"
            type="file"
            class="mr-2 bg-gray-50 block text-xs rounded-sm border truncate max-h-fit file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            on:change={(e) => {
              loadFile(e)
            }}
          />

          <button
            class="hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!input) {
                alert("파일을 선택해주세요.")
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
            <span>추가</span>
          </button>
        </div>
      {:else if action == "addToNpr"}
        <p class="text-lg font-medium mr-1">늘푸른부 성도 추가</p>
        <div class="rounded flex ml-auto">
          <input
            id="example2"
            type="file"
            class="mr-2 bg-gray-50 block text-xs rounded-sm border truncate max-h-fit file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            on:change={(e) => {
              loadFile(e)
            }}
          />

          <button
            class="hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#3493eb]"
            on:click={async () => {
              if (!input) {
                alert("파일을 선택해주세요.")
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
            <span>추가</span>
          </button>
        </div>
      {:else}
        <!-- else content here -->
      {/if}
    </div>
  </div>
  {#if action == "graduate" && seongdos?.length > 0 && page != undefined}
    <Table {seongdos} {page} />
  {:else if (action == "addTeacher" || action == "addToBridge" || action == "addToNpr") && seongdos?.length > 0}
    <TableForCSV {seongdos} />
  {:else}
    <!-- else content here -->
  {/if}
</div>
