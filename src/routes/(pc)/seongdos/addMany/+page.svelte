<script lang="ts">
  import TableForCSV from "./../../../../lib/components/TableForCSV.svelte"
  import { goto } from "$app/navigation"
  import { read, utils } from "xlsx"
  import toast from "svelte-french-toast"
  import { Checkmark, Close } from "carbon-icons-svelte"
  import type { ISeongdo } from "$lib/interfaces"

  $: seongdos = []

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

    const wb = read(csv)
    const sheet = wb.Sheets[wb.SheetNames[0]]

    Object.keys(sheet).map((item) => {
      if (sheet[item]["w"]) {
        sheet[item]["v"] = sheet[item]["w"]
      }
    })

    csv = utils.sheet_to_json<ISeongdo>(wb.Sheets[wb.SheetNames[0]], {
      header: [
        "name",
        "jikbun",
        "birth",
        "gender",
        "phone",
        "address",
        "group1",
        "group2",
        "singeup",
      ],
    })

    seongdos = csv.slice(1)
  }

  const submitHandler = async () => {
    if (seongdos.length == 0) {
      toast("추가할 성도가 없습니다.", { icon: "❗️" })
    }
    const response = await fetch("/api/seongdos", {
      method: "POST",
      body: JSON.stringify({ seongdos }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      toast.success("저장되었습니다.")
      goto(`/seongdos`)
    }
  }
</script>

<div
  id="content"
  class="flex flex-col px-16 pt-8 pb-15 flex w-full bg-white overflow-x-scroll"
>
  <div class="flex w-full justify-between mb-2">
    <h1 class="text-lg font-medium">
      추가될 성도 목록 {seongdos.length > 0 ? `(${seongdos.length}명)` : ""}
    </h1>
    <div class="flex ml-auto gap-2">
      <input
        id="example1"
        type="file"
        class="bg-gray-50 block text-xs rounded-sm border truncate max-h-fit file:mr-3 file:border-0 file:bg-[#237334] file:py-[0.4rem] file:px-4 file:text-xs file:text-white focus:outline-none"
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
          goto("/seongdos")
        }}
      >
        <span class="flex items-center">
          <Close class="text-[#F46055]" />
          <p>닫기</p>
        </span>
      </button>
    </div>
  </div>
  <TableForCSV {seongdos} />
</div>
