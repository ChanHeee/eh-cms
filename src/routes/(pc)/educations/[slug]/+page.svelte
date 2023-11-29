<script lang="ts">
  import type { ISeongdo } from "$lib/interfaces/index.js"
  import {
    Save,
    AddLarge,
    Checkmark,
    Search,
    TrashCan,
    Close,
  } from "carbon-icons-svelte"
  import { onMount } from "svelte"

  export let data

  const placeData = data.education.place
  const timeData = data.education.time
  const startDateData = data.education.startDate
  const endDateData = data.education.endDate
  const seongdosData = data.education.seongdos

  let height
  onMount(() => {
    height = document.getElementById("temp").offsetHeight + 80

    document.getElementById("eduName").value = education.name
    document.getElementById("teacher").value = education.teacher
    document.getElementById("semester").value = education.semester
    document.getElementById("day").value = education.day
    document.getElementById("time").value = education.time
    document.getElementById("startDate").value = education.startDate
    document.getElementById("endDate").value = education.endDate
  })

  const pageSize = 10
  const paginationLen = 5
  $: skip = 0
  $: total = seongdos.length
  $: now = skip / pageSize + 1
  $: min =
    now % paginationLen == 0
      ? (Math.floor(now / paginationLen) - 1) * paginationLen + 1
      : Math.floor(now / paginationLen) * paginationLen + 1
  $: last = Math.ceil(total / pageSize)
  $: pages = getPages()
  $: getPages = () => {
    const result = []
    for (var i = 0; i < paginationLen; i++) {
      if (min + i > last) {
        break
      }
      result.push({
        index: min + i,
        skip: (min - 1 + i) * pageSize,
      })
    }
    return result
  }

  $: education = data.education

  $: isModalHidden = true

  $: searchName = ""
  $: id = education._id
  $: name = education.name
  $: teacher = education.teacher
  $: semester = education.semester
  $: day = education.day
  $: time = timeData
  $: place = placeData
  $: startDate = startDateData
  $: endDate = endDateData
  $: status = education.status
  $: seongdos = seongdosData
  $: seongdoIds = seongdosData.map((seongdo) => {
    return seongdo._id
  })
  $: seongdosSlice = seongdos.slice(skip, now * pageSize)

  $: seongdoList = []

  const updateSeongdoHandler = async (data: ISeongdo) => {
    const response = await fetch("/api/seongdos", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    })
    return response.ok
  }

  const submitHandler = async () => {
    const response = await fetch("/api/educations", {
      method: "PUT",
      body: JSON.stringify({
        id,
        name,
        teacher,
        semester,
        day,
        time,
        place,
        startDate,
        status,
        endDate,
        seongdos: seongdoIds,
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
        id,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      history.back()
    }
  }

  const searchHandler = async () => {
    const response = await fetch(`/api/seongdos?name=${searchName}`, {
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      seongdoList = (await response.json()).seongdos
    }
  }

  const getGroupString = (group1: any, group2: any) => {
    if (group1 == "장년부") {
      return (
        group1 + " > " + group2.split(",")[0] + " > " + group2.split(",")[1]
      )
    } else {
      return group1 + " > " + group2
    }
  }
</script>

<div
  id="content"
  class="sm:px-16 px-6 flex flex-col w-full overflow-scroll bg-white"
>
  <div class="flex flex-col w-full-if-mobile mb-3">
    <form
      id="temp"
      class="flex flex-col bg-white"
      on:submit={async () => {
        const isSuccess = await submitHandler()
        if (isSuccess) {
          alert("저장 되었습니다.")
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
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#237334]"
            class:hidden={status == "terminated" ? true : false}
            on:click={async () => {
              status = "terminated"
              await submitHandler()
              history.back()
            }}
          >
            <Checkmark size={16} />
            <span>수료</span>
          </button>

          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              history.back()
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
                on:change={() => {
                  name = document.querySelector(
                    "#eduName > option:checked"
                  ).value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              >
                <option value="none" class="hidden" />
                <option value="기초반">기초반</option>
                <option value="열매반">열매반</option>
                <option value="청지기반">청지기반</option>
                <option value="새신자반">새신자반</option>
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
                on:change={() => {
                  teacher = document.querySelector(
                    "#teacher > option:checked"
                  ).value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              >
                <option value="none" class="hidden" />
                <option value="고재국 담임목사님">고재국 담임목사님</option>
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
                on:change={() => {
                  semester = document.querySelector(
                    "#semester > option:checked"
                  ).value
                }}
                class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
              >
                <option value="none" class="hidden" />
                <option value="1학기">1학기</option>
                <option value="2학기">2학기</option>
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
                on:change={() => {
                  day = document.querySelector("#day > option:checked").value
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
                bind:value={time}
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
              bind:value={place}
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
                bind:value={startDate}
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
                bind:value={endDate}
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
        <p class="text-lg font-medium mr-1">
          {status == "proceeding" ? "수강 인원" : "수료 인원"}
        </p>
        <p class="text-lg">
          {`(${seongdos.length}명)`}
        </p>
      </div>

      <div class="flex ml-auto gap-2">
        <button
          class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
          on:click={() => {
            isModalHidden = !isModalHidden
          }}
        >
          <AddLarge scale={16} />
          <span>추가</span>
        </button>
      </div>
    </div>

    <div class="flex text-sm border-l mb-7 overflow-scroll">
      <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
        <div
          class=" flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
        >
          사진
        </div>
        {#each seongdosSlice as item}
          <div class="flex justify-center px-2 items-center h-10">
            <img
              class="mx-auto object-cover w-8 h-8"
              src={item.avatar || "/avatar.png"}
              alt=""
            />
          </div>
        {/each}
      </div>
      <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
        <button
          id="nameField"
          class=" flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
        >
          이름
        </button>

        {#each seongdosSlice as item, index}
          <div class="flex px-3 items-center h-10">
            <a href={`/seongdos/${item.name}`}>
              <button>
                {item.name}
              </button>
            </a>
          </div>
        {/each}
      </div>
      <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
        <button
          class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
        >
          직분
        </button>
        {#each seongdosSlice as item}
          <div class="flex px-3 items-center h-10">
            {item.jikbun}
          </div>
        {/each}
      </div>
      <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
        <button
          id="birthField"
          class=" flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
        >
          생년월일
        </button>
        {#each seongdosSlice as item}
          <div class="flex justify-center px-3 items-center h-10">
            {item.birth}
          </div>
        {/each}
      </div>
      <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
        <button
          class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
        >
          나이
        </button>
        {#each seongdosSlice as item}
          <div class="flex px-3 justify-center items-center h-10">
            {item.age ?? ""}
          </div>
        {/each}
      </div>
      <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
        <div
          class=" flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
        >
          핸드폰
        </div>
        {#each seongdosSlice as item}
          <div class="flex justify-center px-3 items-center h-10">
            {item.phone}
          </div>
        {/each}
      </div>
      <div class="flex flex-col flex-auto whitespace-nowrap divide-y border-b">
        <div
          class=" flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
        >
          소속
        </div>
        {#each seongdosSlice as item}
          <div class="flex justify-center px-3 items-center h-10">
            <p class="whitespace-nowrap truncate">
              {getGroupString(item.group1, item.group2)}
            </p>
          </div>
        {/each}
      </div>
      <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
        <button
          class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
        />
        {#each seongdosSlice as item, index}
          <div class="flex items-center px-3 h-10">
            <button
              type="button"
              class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
              on:click={async () => {
                seongdoIds = seongdoIds.filter((seongdo) => seongdo != item._id)
                await submitHandler()
                seongdos = seongdos.filter((seongdo) => seongdo._id != item._id)
              }}
            >
              <TrashCan fill="#4a4a4a" size={20} />
            </button>
          </div>
        {/each}
      </div>
    </div>
    <div class="pagination w-fit mx-auto flex items-center mb-8">
      {#if total > 0}
        <button
          on:click={async () => {
            skip = pages[0].skip
          }}
          class=" p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100"
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            class=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"
            />
          </svg>
        </button>

        {#each pages as page, index}
          <button
            class="px-4 py-2 border-t border-b border-r text-base text-gray-600"
            class:bg-gray-100={index == now - min}
            class:bg-white={index != now - min}
            on:click={async () => {
              skip = page.skip
            }}
          >
            {page.index}
          </button>
        {/each}

        <button
          on:click={async () => {
            if (now == last) {
              return
            }
            if (min + paginationLen - 1 >= last) {
              skip = pages.slice(-1)[0].skip
            } else {
              skip = pages.slice(-1)[0].skip + pageSize
            }
          }}
          class="w-full p-4 border-t border-b border-r text-base rounded-r-xl text-gray-600 bg-white hover:bg-gray-100"
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            class=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"
            />
          </svg>
        </button>
      {/if}
    </div>
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
              on:click|preventDefault={searchHandler}
              ><Search size={20} class="text-gray-600" />
            </button>
          </form>

          <div class="flex text-sm border-l">
            <div
              class="flex flex-col whitespace-nowrap border-r divide-y border-b"
            >
              <div
                class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
              >
                사진
              </div>
              {#each seongdoList as item}
                <div class="flex justify-center px-2 items-center h-10">
                  <img
                    class="mx-auto object-cover w-8 h-8"
                    src={item.avatar || "/avatar.png"}
                    alt=""
                  />
                </div>
              {/each}
            </div>
            <div
              class="flex flex-col whitespace-nowrap border-r divide-y border-b"
            >
              <button
                id="nameField"
                class="flex justify-between bg-[#D9D9D8] px-3 font-bold items-center h-10"
              >
                이름
              </button>

              {#each seongdoList as item, index}
                <div class="flex px-3 items-center h-10">
                  <button>
                    {item.name}
                  </button>
                </div>
              {/each}
            </div>
            <div
              class="flex flex-col w-full whitespace-nowrap divide-y border-b"
            >
              <button
                class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
              >
                직분
              </button>
              {#each seongdoList as item}
                <div class="flex px-3 items-center h-10">
                  {item.jikbun}
                </div>
              {/each}
            </div>

            <div
              class="flex flex-col flex-none whitespace-nowrap border-r divide-y border-b"
            >
              <button
                class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
              />
              {#each seongdoList as item, index}
                <div class="flex items-center px-3 h-10">
                  <button
                    type="button"
                    class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
                    on:click={async () => {
                      if (seongdoIds.includes(item._id)) {
                        alert("이미 등록된 성도입니다.")
                      } else {
                        seongdoIds = [...seongdoIds, item._id]
                        await submitHandler()

                        let { educations, _id, ...rest } = item
                        educations = [...educations, id]
                        await updateSeongdoHandler({
                          id: item._id,
                          educations,
                          name,
                          ...rest,
                        })
                        // isModalHidden = !isModalHidden
                        searchName = ""
                        seongdos = [...seongdos, item]
                      }
                    }}
                  >
                    <AddLarge fill="#4a4a4a" size={20} />
                  </button>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <div class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6">
          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              isModalHidden = !isModalHidden
              seongdoList = []
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
