<script lang="ts">
  import SearchTable from "./SearchTable.svelte"
  import Table from "./Table.svelte"
  import { goto, invalidateAll } from "$app/navigation"
  import type {
    IEducation,
    IPage,
    ISeongdoEduPopulate,
  } from "$lib/interfaces/index.js"
  import {
    Save,
    AddLarge,
    Search,
    TrashCan,
    Close,
    Document,
  } from "carbon-icons-svelte"
  import {
    SeongdoEduPageStore,
    SeongdoEdusStore,
    SeongdoPageStore,
    SeongdosStore,
  } from "$lib/store"
  import toast from "svelte-french-toast"
  import { getEduSlug } from "$lib/utils"
  import { read, utils } from "xlsx"

  export let data: {
    education: IEducation
    seongdoEdus: ISeongdoEduPopulate[]
    page: IPage
    allowedGroup: string[]
    selectList: any
  }

  $: SeongdoEdusStore.set(data.seongdoEdus)
  $: SeongdoEduPageStore.set(data.page)

  $: seongdoEdus = $SeongdoEdusStore
  $: page = $SeongdoEduPageStore

  $: searchName = ""
  $: education = data.education
  $: teacherList = JSON.parse(data.selectList).teacherList

  $: isModalHidden = true

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

    csv = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      header: ["name"],
    })

    let names = csv.slice(1).map((item) => item.name)
    const response = await fetch("/api/seongdoEdus", {
      method: "POST",
      body: JSON.stringify({ education: education._id, names }),
      headers: {
        "content-type": "application/json",
      },
    })
    toast.success("저장되었습니다.")
    await invalidateAll()
  }

  const submitHandler = async () => {
    const response = await fetch("/api/educations", {
      method: "PUT",
      body: JSON.stringify({
        ...education,
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    return response.ok
  }

  const deleteHandler = async () => {
    const response = await fetch("/api/educations", {
      method: "DELETE",
      body: JSON.stringify({
        id: education._id,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      toast.success("삭제되었습니다.")
      history.back()
    }
  }

  const searchHandler = async () => {
    const response = await fetch(`/api/seongdos?name=${searchName}&take=10`, {
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      const result = await response.json()
      $SeongdosStore = result.seongdos
      $SeongdoPageStore = result.page
      $SeongdoPageStore.requestParams.take = 10
    }
  }
</script>

<div
  id="content"
  class="sm:px-16 px-6 flex flex-col w-full overflow-scroll bg-white"
>
  <div class="flex flex-col w-full-if-mobile">
    <form
      id="temp"
      class="flex flex-col bg-white"
      on:submit={async () => {
        const isSuccess = await submitHandler()
        if (isSuccess) {
          toast.success("저장 되었습니다.")
          goto(
            `/educations/detail/${getEduSlug(
              education.name,
              education.semester,
              education.startDate,
              education.day,
              education.time
            )}`
          )
        }
      }}
    >
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2"
      >
        <h1 class="text-lg font-medium">강의 정보</h1>
        <div class="flex ml-auto gap-2">
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
          >
            <Save size={16} />
            <span>저장</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
            on:click={() => {
              if (!confirm("삭제하시겠습니까?")) {
                return false
              }
              deleteHandler()
            }}
          >
            <TrashCan size={16} />
            <span>삭제</span>
          </button>

          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              const urlParams = new URLSearchParams(document.location.search)
              const isAfterCreate = urlParams.get("create")
              if (isAfterCreate == "true") {
                goto("/educations")
              } else {
                history.back()
              }
            }}
          >
            <span class="flex items-center">
              <!-- <p class="font-medium mr-1 text-[#FBA244]">X</p> -->
              <Close class="text-[#FBA244]" />
              <p>닫기</p>
            </span>
          </button>
        </div>
      </div>

      <div class="flex flex-col text-sm gap-3">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex w-full h-8 border-gray-300 border-x border-y">
            <label
              for="eduName"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
              >교육 이름</label
            >
            <div class="flex flex-auto justify-start bg-gray-50 px-1">
              <select
                id="eduName"
                value={education.name}
                on:change={() => {
                  education.name = document.querySelector(
                    "#eduName > option:checked"
                  ).value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              >
                <option value="none" class="hidden" />
                <option value="기초반">기초반</option>
                <option value="성숙반">성숙반</option>
                <option value="사명자반">사명자반</option>
              </select>
            </div>
          </div>
          <div
            class="flex w-full h-8 border-gray-300 bg-gray-50 border-x border-y"
          >
            <label
              for="teacher"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
              >강사</label
            >
            <div class="flex w-full justify-center gap-3 px-1">
              <select
                id="teacher"
                value={education.teacher}
                on:change={() => {
                  education.teacher = document.querySelector(
                    "#teacher > option:checked"
                  ).value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              >
                <option value="none" class="hidden" />
                {#each teacherList as item}
                  <option value={item}>{item}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex w-full h-8 border-gray-300 border-x border-y">
            <label
              for="semester"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
              >학기</label
            >
            <div class="flex flex-auto justify-start bg-gray-50 px-1">
              <select
                id="semester"
                value={education.semester}
                on:change={() => {
                  education.semester = document.querySelector(
                    "#semester > option:checked"
                  ).value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              >
                <option value="none" class="hidden" />
                {#if education.name == "기초반"}
                  <option value="1학기">1학기</option>
                  <option value="2학기">2학기</option>
                {:else if education.name == "성숙반"}
                  <option value="큐티학교">큐티학교</option>
                  <option value="기독교교양">기독교교양</option>
                {:else if education.name == "사명자반"}
                  <option value="기도학교">기도학교</option>
                  <option value="선교학교">선교학교</option>
                {/if}
              </select>
            </div>
          </div>
          <div
            class="flex w-full h-8 border-gray-300 bg-gray-50 border-x border-y"
          >
            <label
              for="day"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
              >교육 요일</label
            >
            <div class="flex w-full justify-center gap-3 px-1">
              <select
                id="day"
                value={education.day}
                on:change={() => {
                  education.day = document.querySelector(
                    "#day > option:checked"
                  ).value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              >
                <option value="none" class="hidden" />
                <option value="월요일">월요일</option>
                <option value="화요일">화요일</option>
                <option value="수요일">수요일</option>
                <option value="목요일">목요일</option>
                <option value="금요일">금요일</option>
                <option value="토요일">토요일</option>
                <option value="주일">주일</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex w-full h-8 border-gray-300 border-x border-y">
            <label
              for="time"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
              >교육 시간</label
            >

            <div class="flex flex-auto justify-start bg-gray-50 pl-1.5 pr-1">
              <input
                id="time"
                type="time"
                value={education.time}
                on:input={(e) => {
                  education.time = e.target.value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              />
            </div>
          </div>
          <div
            class="flex w-full h-8 border-gray-300 bg-gray-50 border-x border-y"
          >
            <label
              for="place"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
              >교육 장소</label
            >
            <input
              id="place"
              type="text"
              value={education.place}
              on:input={(e) => {
                education.place = e.target.value
              }}
              class="flex w-full bg-gray-50 px-2 text-gray-900 text-sm focus:outline-0"
            />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex w-full h-8 border-gray-300 border-x border-y">
            <label
              for="startDate"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
              >시작일</label
            >
            <div class="flex flex-auto justify-start bg-gray-50 pl-1.5 pr-1">
              <input
                id="startDate"
                type="date"
                value={education.startDate}
                on:input={(e) => {
                  education.startDate = e.target.value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              />
            </div>
          </div>
          <div class="flex w-full h-8 border-gray-300 border-x border-y">
            <label
              for="endDate"
              class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
              >종료일</label
            >
            <div class="flex flex-auto justify-start bg-gray-50 pl-1.5 pr-1">
              <input
                id="endDate"
                type="date"
                value={education.endDate}
                on:input={(e) => [(education.endDate = e.target.value)]}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
    <div
      class=" bg-white sticky pt-8 top-0 flex justify-between items-start pb-2"
    >
      <div class="flex items-center">
        <p class="text-lg font-medium mr-1">수강 인원</p>
        <p class="text-lg">
          {`(${page.totalSize}명)`}
        </p>
      </div>

      <div class="flex ml-auto gap-2">
        <label for="file">
          <div
            class="cursor-pointer hidden md:flex h-fit items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#237334]"
          >
            <Document scale={16} />
            <span>엑셀로 추가</span>
          </div>
        </label>
        <input
          id="file"
          type="file"
          class="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          on:change={(e) => {
            loadFile(e)
          }}
        />
        <button
          class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
          on:click={() => {
            $SeongdosStore = []
            isModalHidden = !isModalHidden
          }}
        >
          <AddLarge scale={16} />
          <span>추가</span>
        </button>
      </div>
    </div>
    <Table />
  </div>
</div>

<div
  class="relative z-10 h-full"
  class:hidden={isModalHidden}
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
  <div class="w-full fixed inset-0 z-10 w-screen">
    <div
      class="h-full flex min-h-full items-end justify-center p-4 text-center items-center"
    >
      <div
        class="sm:h-2/3 h-3/4 sm:max-md:w-2/3 md:w-1/3 w-full relative transform rounded-md bg-white shadow-xl transition-all"
      >
        <div
          class="overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
        >
          <form class="flex w-full items-center mx-auto">
            <input
              id="name"
              type="text"
              bind:value={searchName}
              on:focus={() => {
                searchName = ""
              }}
              class="w-full bg-gray-50 border-gray-300 border-y border-l text-gray-900 text-sm focus:outline-0 p-2"
              placeholder="이름"
            />
            <button
              class="bg-[#B0B1B0] p-2 border-gray-300 border-y border-r"
              on:click|preventDefault={async () => {
                await searchHandler()
              }}
              ><Search size={20} class="text-gray-600" />
            </button>
          </form>

          {#if $SeongdosStore.length > 0}
            <SearchTable educationId={education._id} />
          {/if}
        </div>

        <div class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6">
          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              isModalHidden = !isModalHidden
              searchName = ""
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#FBA244]" />
              <p>닫기</p>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
