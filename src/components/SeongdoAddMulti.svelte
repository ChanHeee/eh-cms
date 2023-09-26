<script lang="ts">
  import TableForCSV from "./TableForCSV.svelte"
  import { read, writeFileXLSX, utils } from "xlsx"

  //icon
  import Search from "carbon-icons-svelte/lib/Search.svelte"

  //component
  import Pagination from "./Pagination.svelte"
  import SeongdoSideBar from "./SeongdoSideBar.svelte"
  import SideTable from "./SideTable.svelte"

  import {
    searchName,
    page,
    seongdoResponse,
    seongdoSearchBody,
    getSeongdos,
    seongdoDetail,
  } from "$lib"
  import { Checkmark } from "carbon-icons-svelte"
  import Table from "./Table.svelte"

  //variable
  $: seongdos = []

  const submitHandler = async () => {
    if (seongdos.length == 0) {
      return alert("추가할 성도가 없습니다.")
    }
    const response = await fetch("/api/seongdos/createMany", {
      method: "POST",
      body: JSON.stringify(seongdos),
      headers: {
        "content-type": "application/json",
      },
    })

    if (response.ok) {
      const result = await getSeongdos($seongdoSearchBody)
      if (result.ok) {
        seongdoResponse.set(await result.json())
      }
      page.set("seongdo")
      alert("저장되었습니다.")
    }
  }

  var loadFile = async function (event) {
    var input = event.target
    var file = input.files[0]

    const readFile = (file: File) =>
      new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => resolve(reader.result)

        reader.readAsArrayBuffer(file)
      })

    let csv = await readFile(file)

    interface IAddSeongdo {
      name?: string
      birth?: string
      phone?: string
      jikbun?: string
      address?: string
    }

    const wb = read(csv)
    const sheet = wb.Sheets[wb.SheetNames[0]]
    Object.keys(sheet).map((item) => {
      if (sheet[item]["w"]) {
        sheet[item]["v"] = sheet[item]["w"]
      }
    })

    csv = utils.sheet_to_json<IAddSeongdo>(wb.Sheets[wb.SheetNames[0]], {
      header: ["name", "jikbun", "birth", "phone", "address"],
    })

    seongdos = csv.slice(1)
  }

  const searchHandler = async (name: string) => {
    const response = await getSeongdos({ name })
    if (response.ok) {
      seongdoResponse.set(await response.json())
    }
  }
</script>

<SeongdoSideBar />

<aside class="flex flex-col w-1/4 px-6 py-8">
  <!-- 이름 검색 -->
  <div class="flex w-full items-center mx-auto mb-4">
    <!-- <input
      type="text"
      id="voice-search"
      bind:value={searchNamee}
      class="w-full bg-gray-50 border-y border-l border-gray-300 text-gray-900 text-sm focus:outline-0 p-2"
      placeholder="이름"
    />
    <button
      class="bg-[#B0B1B0] p-2 border-y border-r border-gray-300"
      on:click={() => {
        searchHandler(searchNamee)
      }}
      ><Search size={20} class="text-gray-600" />
    </button> -->
  </div>
</aside>

<div
  id="content"
  class="items-center flex flex-col px-12 pt-8 pb-15 flex w-full bg-white overflow-x-scroll"
>
  <div class="flex w-full justify-between mb-2">
    <h1 class="text-lg font-medium">
      추가될 성도 목록 {seongdos.length > 0 ? `(${seongdos.length}명)` : ""}
    </h1>
    <div class="flex ml-auto gap-2">
      <input
        id="example1"
        type="file"
        class="bg-gray-50 block text-xs rounded-sm border truncate max-h-fit file:mr-3 file:border-0 file:bg-[#F46055] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        on:change={(e) => {
          loadFile(e)
        }}
      />

      <button
        type="submit"
        class="flex h-fit border-[#F46055] border items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
        on:click={submitHandler}
      >
        <Checkmark scale={16} />
        <span>저장</span>
      </button>

      <button
        type="button"
        class="h-fit border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
        on:click={() => {
          page.set("seongdo")
        }}
      >
        <span class="flex items-center">
          <p class="font-medium mr-1 text-[#F46055]">X</p>
          <p>닫기</p>
        </span>
      </button>
    </div>
  </div>
  <TableForCSV {seongdos} />
</div>

<style>
  #content:after {
    content: "";
    display: block;
    height: 50px;
    width: 100%;
  }
</style>
