<script lang="ts">
  import { invalidateAll } from "$app/navigation"

  //icon

  import {
    UserFollow,
    UserMultiple,
    Checkmark,
    Search,
  } from "carbon-icons-svelte"

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

  //variable
  $: searchNamee = $searchName
  let name = ""
  let avatar = ""
  let birth = ""
  let phone = ""
  let jikbun = ""
  $: address = ""
  $: extraAddress = ""
  $: detailAddress = ""
  $: fullAddress =
    address == "" ? "" : address + ", " + detailAddress + " " + extraAddress
  $: eduIds = []
  $: gichoChecked = eduIds.filter((value) => value.name == "기초반").length > 0
  $: yeolmaeChecked =
    eduIds.filter((value) => value.name == "열매반").length > 0
  $: cheongjigiChecked =
    eduIds.filter((value) => value.name == "청지기반").length > 0
  const today = new Date().toISOString().substring(0, 10)

  const searchAddress = () => {
    new daum.Postcode({
      oncomplete: function (data) {
        var addr = "" // 주소 변수
        var extraAddr = "" // 참고항목 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === "R") {
          // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if (data.userSelectedType === "R") {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== "") {
            extraAddress = "(" + extraAddr + ")"
          }
        } else {
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        document.getElementById("address").value = addr
        address = addr

        // 커서를 상세주소 필드로 이동한다.
        document.getElementById("detailAddress")?.removeAttribute("disabled")
        document.getElementById("detailAddress").value = ""
        document.getElementById("detailAddress").focus()
      },
    }).open()
  }

  const submitHandler = async () => {
    let eduNames = []
    if (gichoChecked) {
      eduNames.push("기초반")
    }
    if (yeolmaeChecked) {
      eduNames.push("열매반")
    }
    if (cheongjigiChecked) {
      eduNames.push("청지기반")
    }
    const response = await fetch("/api/seongdos/create", {
      method: "POST",
      body: JSON.stringify({
        name,
        avatar,
        birth,
        phone,
        jikbun,
        address: fullAddress,
        eduNames,
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    if (response.ok) {
      const result = await getSeongdos($seongdoSearchBody)
      if (result.ok) {
        seongdoResponse.set(await result.json())
      }
      const { seongdo } = await response.json()
      const { eduIds, ...rest } = seongdo
      seongdoDetail.set({
        eduIds: eduNames.map((name) => {
          return { _id: "", name }
        }),
        ...rest,
      })
      page.set("seongdoDetail")
      alert("저장되었습니다.")
    }
  }

  var loadFile = function (event) {
    var input = event.target
    var file = input.files[0]
    var type = file.type

    var output = document.getElementById("preview")

    output.src = URL.createObjectURL(event.target.files[0])
    output.onload = function () {
      URL.revokeObjectURL(output.src) // free memory
    }
    avatar = event.target.files[0]
    var reader = new FileReader()
    try {
      reader.onload = (result) => {
        avatar = result.target.result
      }
      //reader.readAsText(event.target.files[0])
      reader.readAsDataURL(event.target.files[0])
    } catch (err) {
      console.log("err", err)
    }
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
    <input
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
    </button>
  </div>

  <SideTable />
  <Pagination />
</aside>

<div id="content" class="px-12 py-8 flex w-full bg-white overflow-x-scroll">
  <div class="flex mr-8">
    <label for="photo-dropbox">
      <img
        alt=""
        id="preview"
        src="/avatar.png"
        class="border-gray-300 border w-16 h-16 mb-3 object-cover hover:opacity-75"
      />
    </label>
    <input
      id="photo-dropbox"
      type="file"
      accept="image/*"
      class="sr-only"
      on:change={(e) => {
        loadFile(e)
      }}
    />
  </div>
  <form class="flex flex-col" on:submit={submitHandler}>
    <div class="flex justify-between items-start w-[43rem] mb-2">
      <h1 class="text-lg font-medium">새 성도 추가</h1>
      <div class="flex mb-2 ml-auto gap-2">
        <button
          type="submit"
          class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
        >
          <Checkmark scale={16} />
          <span>저장</span>
        </button>

        <button
          type="button"
          class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
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

    <div class="flex flex-col text-sm gap-3">
      <div class="flex gap-3">
        <div class="flex h-8 border-gray-300 border-x border-y">
          <label
            for="name"
            class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
            >이름</label
          >
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            class="flex w-[15rem] bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
          />
        </div>
        <div class="flex h-8 border-gray-300 border-x border-y">
          <label
            for="date"
            class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
            >생년월일</label
          >

          <input
            id="date"
            type="date"
            on:change={(e) => {
              birth = e.target.value
            }}
            class="flex w-[15rem] bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
            min="1900-01-01"
            max={today}
            value={today}
          />
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex h-8 border-gray-300 border-x border-y">
          <label
            for="phone"
            class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] text-ellipsis overflow-hidden"
            >휴대전화</label
          >

          <input
            id="phone"
            type="text"
            bind:value={phone}
            class="flex w-[15rem] bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
            placeholder="ex) 010-0000-0000"
          />
        </div>
        <div class="flex h-8 border-gray-300 border-x border-y">
          <label
            for="jikbun"
            class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
            >직분</label
          >

          <select
            id="jikbun"
            on:change={() => {
              jikbun = document.querySelector("#jikbun > option:checked").value
            }}
            class="flex w-[15rem] bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 px-2"
          >
            <option value="none" class="hidden" /><option value="장로"
              >장로</option
            >
            <option value="안수집사">안수집사</option>
            <option value="권사">권사</option>
            <option value="집사">집사</option>
            <option value="성도">성도</option>
            <option value="청년">청년</option>
          </select>
        </div>
      </div>

      <div class="flex w-[43rem] h-8 border-gray-300 border-x border-y">
        <label
          for=""
          class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >주소</label
        >

        <input
          id="address"
          autocomplete="off"
          class="flex w-full justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
          on:click={searchAddress}
        />
      </div>
      <div
        class="relative flex h-8 w-[43rem] border-gray-300 border-x border-y"
      >
        <label
          for=""
          class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >상세주소</label
        >

        <input
          id="detailAddress"
          bind:value={detailAddress}
          autocomplete="off"
          type="text"
          class="flex justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
          disabled
        />
      </div>
      <div
        class="relative flex h-8 w-[43rem] border-gray-300 border-x border-y"
      >
        <label
          for=""
          class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >수강내역</label
        >

        <div
          class="gap-2 flex items-center bg-gray-50 border-0 text-gray-900 w-full text-xs focus:outline-0 p-2"
        >
          <div class="flex">
            <input
              class="hidden"
              type="checkbox"
              id="기초반"
              checked={gichoChecked}
              on:change={() => {
                gichoChecked = !gichoChecked
              }}
            />
            <label
              id="gicho"
              for="기초반"
              class="select-none font-medium px-1.5 py-0.5 rounded"
              class:bg-[#FBA244]={gichoChecked}
              class:text-white={gichoChecked}
              class:bg-gray-300={!gichoChecked}
            >
              기초반
            </label>
          </div>
          <div class="flex">
            <input
              class="hidden"
              type="checkbox"
              id="열매반"
              checked={yeolmaeChecked}
              on:change={() => {
                yeolmaeChecked = !yeolmaeChecked
              }}
            />
            <label
              id="yeolma"
              for="열매반"
              class="select-none font-medium px-1.5 py-0.5 rounded"
              class:bg-[#FBA244]={yeolmaeChecked}
              class:text-white={yeolmaeChecked}
              class:bg-gray-300={!yeolmaeChecked}
            >
              열매반
            </label>
          </div>
          <div class="flex">
            <input
              class="hidden"
              type="checkbox"
              id="청지기반"
              checked={cheongjigiChecked}
              on:change={() => {
                cheongjigiChecked = !cheongjigiChecked
              }}
            />
            <label
              id="cheongjigi"
              for="청지기반"
              class="select-none font-medium px-1.5 py-0.5 rounded"
              class:bg-[#FBA244]={cheongjigiChecked}
              class:text-white={cheongjigiChecked}
              class:bg-gray-300={!cheongjigiChecked}
            >
              청지기반
            </label>
          </div>
        </div>
      </div>
    </div>
  </form>
</div>
