<script lang="ts">
  import { goto } from "$app/navigation"
  import { Checkmark } from "carbon-icons-svelte"
  import toast from "svelte-french-toast"

  export let data
  $: teacherList = JSON.parse(data.selectList).teacherList

  let name = ""
  let teacher = ""
  let semester = ""
  let day = ""
  let time = ""
  let place = ""
  let startDate = ""
  let endDate = ""

  const submitHandler = async () => {
    const response = await fetch("/api/educations", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        teacher,
        semester,
        day,
        time,
        place,
        startDate,
        endDate,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      toast.success("저장되었습니다.")
      goto(
        `/educations/detail/${getSlug(name, semester, startDate)}?create=true`
      )
    }
  }

  const getSlug = (name: string, semester: string, startDate: string) => {
    return `${name}-${semester}-${startDate}`
  }
</script>

<div id="content" class="sm:px-16 px-6 pt-8 flex w-full bg-white">
  <form class="flex flex-col w-full-if-mobile" on:submit={submitHandler}>
    <!-- 새강의생성 -->
    <div class="flex justify-between items-start mb-2">
      <h1 class="text-lg font-medium">새 강의 생성</h1>
      <div class="flex mb-2 ml-auto gap-2">
        <button
          type="submit"
          class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#FBA244]"
        >
          <Checkmark scale={16} />
          <span>저장</span>
        </button>

        <button
          type="button"
          class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
          on:click={async () => {
            history.back()
          }}
        >
          <span class="flex items-center">
            <p class="font-medium mr-1 text-[#FBA244]">X</p>
            <p>닫기</p>
          </span>
        </button>
      </div>
    </div>

    <div class="flex flex-col text-sm gap-3">
      <!-- 교육이름 / 강사 -->
      <div class="flex gap-3 flex-col-if-mobile">
        <div class="flex w-full h-8 border-gray-300 border-x border-y">
          <label
            for="name"
            class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
            >교육 이름</label
          >
          <div class="flex flex-auto justify-start bg-gray-50 px-1">
            <select
              id="name"
              required
              on:change={() => {
                name = document.querySelector("#name > option:checked").value
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
              required
              id="teacher"
              on:change={() => {
                teacher = document.querySelector(
                  "#teacher > option:checked"
                ).value
              }}
              class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
            >
              <option value="none" class="hidden" />
              {#each teacherList as teacher}
                <!-- content here -->
                <option value={teacher}>{teacher}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
      <!-- 학기 / 교육요일 -->
      <div class="flex gap-3 flex-col-if-mobile">
        <div class="flex w-full h-8 border-gray-300 border-x border-y">
          <label
            for="semester"
            class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
            >학기</label
          >
          <div class="flex flex-auto justify-start bg-gray-50 px-1">
            <select
              required
              id="semester"
              on:change={() => {
                semester = document.querySelector(
                  "#semester > option:checked"
                ).value
              }}
              class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
            >
              <option value="none" class="hidden" />
              {#if name == "기초반"}
                <option value="1학기">1학기</option>
                <option value="2학기">2학기</option>
              {:else if name == "성숙반"}
                <option value="큐티학교">큐티학교</option>
                <option value="기독교교양">기독교교양</option>
                <option value="구약개관">구약개관</option>
              {:else if name == "사명자반"}
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
              required
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
      <!-- 교육시간 / 교육장소 -->
      <div class="flex gap-3 flex-col-if-mobile">
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
              required
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
            required
            class="flex w-full bg-gray-50 px-2 text-gray-900 text-sm focus:outline-0"
          />
        </div>
      </div>
      <!-- 시작일 / 종료일 -->
      <div class="flex gap-3 flex-col-if-mobile">
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
              required
              class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
            />
          </div>
        </div>
        <div class="flex w-full h-8 border-gray-300 border-x border-y">
          <label
            for="endDate"
            class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
            required>종료일</label
          >
          <div class="flex flex-auto justify-start bg-gray-50 pl-1.5 pr-1">
            <input
              id="endDate"
              type="date"
              bind:value={endDate}
              required
              class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
            />
          </div>
        </div>
      </div>
    </div>
  </form>
</div>
