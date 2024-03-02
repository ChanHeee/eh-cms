<script lang="ts">
  import TableForCSV from "./../../../../lib/components/TableForCSV.svelte"
  import { goto } from "$app/navigation"
  import { read, utils } from "xlsx"
  import toast from "svelte-french-toast"
  import { Checkmark, Close, Renew } from "carbon-icons-svelte"
  import type { ISeongdo } from "$lib/interfaces"

  $: seongdos = []
  $: addedNum = 0

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
        "gender",
        "enrolled_at",
        "birth",
        "jikbun",
        "singeup",
        "phone",
        "group1",
        "group2",
        "address",
        "detailAddress",
      ],
    })

    seongdos = csv.slice(1)

    Promise.all(
      seongdos.map(async (seongdo) => {
        const {
          name,
          gender,
          enrolled_at,
          birth,
          jikbun,
          singeup,
          phone,
          group1,
          group2,
          address,
          detailAddress,
        } = seongdo

        seongdo.name = name?.trim()
        seongdo.originalName = name?.trim()
        seongdo.gender = gender || ""
        seongdo.enrolled_at = enrolled_at || ""
        seongdo.birth = birth || ""
        seongdo.jikbun = jikbun || ""
        seongdo.singeup = singeup || ""
        seongdo.phone = phone || ""
        seongdo.group1 = group1 || ""
        seongdo.group2 = group2 || ""

        if (detailAddress) {
          const response = await fetch(`/api/admin/juso?keyword=${address}`, {
            method: "GET",
            headers: { "content-type": "application/json" },
          })

          if (response.ok) {
            const { roadAddrPart1, roadAddrPart2 } = await response.json()

            if (roadAddrPart1) {
              seongdo.address = `${roadAddrPart1}, ${detailAddress}${roadAddrPart2}`
            }
          }
        } else {
          seongdo.address = address || ""
        }
      })
    )
  }

  const seongdoAdd = async () => {
    const response = await fetch("/api/seongdos", {
      method: "POST",
      body: JSON.stringify({ seongdos }),
      headers: {
        "content-type": "application/json",
      },
    })

    if (response.ok) {
      const result = await response.json()
      goto(`/seongdos`)
    }
  }

  const seongdoUpdate = async () => {
    const response = await fetch("/api/seongdos", {
      method: "POST",
      body: JSON.stringify({ seongdos, update: true }),
      headers: {
        "content-type": "application/json",
      },
    })

    if (response.ok) {
      const result = await response.json()
      goto(`/seongdos`)
    }
  }

  const submitHandler = async (
    input: { update: boolean } = { update: false }
  ) => {
    if (seongdos.length == 0) {
      toast("입력된 성도가 없습니다.", { icon: "❗️" })
    } else {
      if (input.update) {
        toast.promise(seongdoUpdate(), {
          loading: "저장 중입니다...",
          success: `저장되었습니다!`,
          error: "오류가 발생했습니다.",
        })
      } else {
        toast.promise(seongdoAdd(), {
          loading: "저장 중입니다...",
          success: `저장되었습니다!`,
          error: "오류가 발생했습니다.",
        })
      }
    }
    // const response = await fetch("/api/seongdos", {
    //   method: "POST",
    //   body: JSON.stringify({ seongdos }),
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // })

    // if (response.ok) {
    //   const result = await response.json()
    //   const seongdos = result.seongdos
    //   toast.success(`${seongdos.length}명의 성도가 저장되었습니다.`)
    //   goto(`/seongdos`)
    // }
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
      <a
        href="https://chemical-slug-198.notion.site/e19681f2e69c4d5fb21747b50411111b"
        target="_blank"
      >
        <button
          type="submit"
          class="flex h-fit border-[#F46055] border items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
        >
          <span>❔</span>
          <span>등록 가이드</span>
        </button>
      </a>
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
        on:click={() => submitHandler()}
      >
        <Checkmark scale={16} />
        <span>추가</span>
      </button>
      <button
        class="flex h-fit border-[#F46055] border items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
        on:click={() => submitHandler({ update: true })}
      >
        <Renew scale={16} />
        <span>수정</span>
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
