<script lang="ts">
  import SearchTable from "./SearchTable.svelte"
  import { goto, invalidateAll } from "$app/navigation"
  import {
    getAgeFromBirth,
    getEduSlug,
    getGroupItem,
    getGroupString,
    getSearchParams,
    isAllowGroup,
    textShortenWithEllipsis,
  } from "$lib/utils"
  import {
    AddLarge,
    Checkmark,
    Close,
    Search,
    TrashCan,
  } from "carbon-icons-svelte"
  import {
    AllowedGroupStore,
    SeongdoPageStore,
    SeongdosStore,
  } from "$lib/store"
  import type {
    IFamily,
    ISeongdo,
    ISeongdoEduPopulate,
    ISimbang,
  } from "$lib/interfaces"
  import toast from "svelte-french-toast"
  import { onMount } from "svelte"
  export let data: {
    seongdo: ISeongdo
    family: IFamily
    simbangs: ISimbang[]
    simbangId: string
    groupList: string[]
    seongdoEdus: ISeongdoEduPopulate[]
  }

  onMount(async () => {
    // const temp = document.getElementById("preview")
    // seongdo.avatar = await dataURItoString(temp.src)

    selectedSimbang = data.simbangs.filter(
      (simbang) => simbang._id == data.simbangId
    )[0]
    if (selectedSimbang) {
      date = selectedSimbang?.date
      hymn = selectedSimbang?.hymn
      bible = selectedSimbang?.bible
      simbangja = selectedSimbang?.simbangja
      companion = selectedSimbang?.companion
      detail = selectedSimbang?.detail
    }
  })

  $: groupList = data.groupList
  // value for senogdo detail
  $: seongdo = data.seongdo

  let seongdoName = data.seongdo.name

  $: ageWithString = seongdo.age ? seongdo.age + " 세" : ""
  $: groupItem = getGroupItem(seongdo.group1, seongdo.group2)
  $: group2Add = groupItem.group2Add
  $: addressWithExtraAddress = extraAddress
    ? address + " (" + extraAddress + ")"
    : address
  $: addressData = seongdo.address
  $: address = addressData.split(",")[0] || ""
  $: detailAddress = extraAddress
    ? addressData.split(",")[1]?.split("(")[0]?.slice(1, -1)
    : addressData.split(",")[1]?.split("(")[0]?.slice(1) || ""

  $: extraAddress = addressData.split(" (")[1]?.slice(0, -1) || ""

  $: fullAddress = getFullAddress()

  $: getFullAddress = () => {
    if (address == "") {
      return seongdo.address
    } else if (extraAddress == "" && detailAddress == "") {
      return seongdo.address
    } else if (extraAddress == "") {
      return address + ", " + detailAddress
    } else {
      return address + ", " + detailAddress + " (" + extraAddress + ")"
    }
  }
  $: hoverOnAvatar = false

  // value for family
  const familyAddHandler = (seongdo: ISeongdo) => {
    selectedSeongdo = seongdo
  }
  let selectedSeongdo: ISeongdo | null
  $: selectedSeongdo = selectedSeongdo

  $: addNonSeongdo = false
  $: addedName = ""
  $: addedGender = ""
  $: addedBirth = ""
  $: addedPhone = ""
  let selectedNonSeongdoFamily: {
    classification: string
    name: string
    gender: string
    birth: string
    phone: string
  } | null
  $: selectedNonSeongdoFamily = selectedNonSeongdoFamily

  $: family = data.family
  $: familyId = family?._id
  $: members = family?.members || []
  $: memberIds = family?.memberIds || []
  $: familyDetail = family?.detail

  $: searchName = ""
  $: classificationValue = ""
  $: classification = ""
  $: familyClassList = JSON.parse(data.selectList).familyClassList

  // value for simbang
  $: simbangs = data.simbangs
  $: date = ""
  $: hymn = ""
  $: bible = ""
  $: simbangja = ""
  $: companion = ""
  $: detail = ""
  $: teacherList = JSON.parse(data.selectList).teacherList
  let selectedSimbang: ISimbang | null
  $: selectedSimbang

  // for service
  let service: {
    group1: string
    group2: string
    classification: string
  } = {
    group1: "",
    group2: "",
    classification: "",
  }
  $: service = service
  $: groupItemForService = getGroupItem(service?.group1, service?.group2)
  $: group2AddForService = ""

  // for seongdoEdus
  $: seongdoEdus = data.seongdoEdus
  $: isServiceModalHidden = true
  $: isFamilyModalHidden = true
  $: isSimbangModalHidden = selectedSimbang ? false : true

  //for crop profile
  import Cropper from "svelte-easy-crop"
  import { getCroppedImg, getThumbFile } from "$lib/utils/canvasUtils"

  let crop = { x: 0, y: 0 }
  let zoom = 1
  let image, fileinput, pixelCrop, croppedImage, croppedImageForRequest: any
  function onFileSelected(e) {
    let imageFile = e.target.files[0]

    let reader = new FileReader()
    reader.onload = (e) => {
      image = e.target.result
    }
    reader.readAsDataURL(imageFile)
  }

  function reset() {
    croppedImage = null
    image = null
  }

  const seongdoUpdate = async () => {
    const { name, originalName, age, group2, address, ...rest } = seongdo
    const response = await fetch("/api/seongdos", {
      method: "PUT",
      body: JSON.stringify({
        name: name.trim(),
        originalName: name.trim(),
        age: getAgeFromBirth(seongdo.birth),
        group2: group2Add
          ? groupItem.group2 + "," + group2Add
          : groupItem.group2,
        address: fullAddress,
        // thumb: seongdo.avatar ? await getThumbFile(seongdo.avatar) : "",
        ...rest,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      seongdoName = seongdo.name
      goto(`/seongdos/${seongdo.name}`)
    }
  }
  const submitHandler = async () => {
    const { name } = seongdo
    let response = await fetch(`/api/seongdos/${name}`, {
      headers: {
        "content-type": "application/json",
      },
    })
    const result = await response.json()

    if (name != seongdoName && result.seongdo) {
      toast.error("이미 등록된 이름은 사용할 수 없습니다.")
    } else {
      if (family) {
        response = await fetch(`/api/families/${familyId}`, {
          method: "PUT",
          body: JSON.stringify({
            members,
            memberIds,
            detail: family.detail,
          }),
          headers: {
            "content-type": "application/json",
          },
        })
      }

      toast.promise(seongdoUpdate(), {
        loading: "저장 중입니다...",
        success: `저장되었습니다!`,
        error: "오류가 발생했습니다.",
      })
    }
  }

  const deleteHandler = async () => {
    const response = await fetch("/api/seongdos", {
      method: "DELETE",
      body: JSON.stringify({
        id: seongdo._id,
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
            extraAddress = extraAddr
          }
        } else {
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        // document.getElementById("address").value = addr
        address = addr

        // 커서를 상세주소 필드로 이동한다.
        // document.getElementById("detailAddress")?.removeAttribute("disabled")
        // document.getElementById("detailAddress").value = ""
        detailAddress = ""
        document.getElementById("detailAddress").focus()
      },
    }).open()
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

  const familyHandler = async () => {
    if (familyId) {
      const response = await fetch(`/api/families/${familyId}`, {
        method: "PUT",
        body: JSON.stringify({
          memberIds,
          members,
          detail: familyDetail,
        }),
        headers: {
          "content-type": "application/json",
        },
      })

      if (response.ok) {
        await invalidateAll()
      }
      return response.ok
    } else {
      const response = await fetch(`/api/families`, {
        method: "POST",
        body: JSON.stringify({
          memberIds,
          members,
          detail: familyDetail,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
      if (response.ok) {
        await invalidateAll()
      }
      return response.ok
    }
  }

  const simbangHandler = async () => {
    if (!date || !simbangja) {
      toast.error("심방날짜와 심방자를 입력해주세요.")
    } else {
      if (selectedSimbang) {
        const response = await fetch(`/api/simbangs`, {
          method: "PUT",
          body: JSON.stringify({
            id: selectedSimbang._id,
            date,
            hymn,
            bible,
            simbangja,
            companion,
            detail,
          }),
          headers: {
            "content-type": "application/json",
          },
        })
        // return response.ok
        isSimbangModalHidden = true
        date = ""
        hymn = ""
        bible = ""
        simbangja = ""
        companion = ""
        detail = ""
        toast.success("수정되었습니다.")
        return await invalidateAll()
      } else {
        const response = await fetch(`/api/simbangs`, {
          method: "POST",
          body: JSON.stringify({
            seongdoId: seongdo._id,
            date,
            hymn,
            bible,
            simbangja,
            companion,
            detail,
          }),
          headers: {
            "content-type": "application/json",
          },
        })
        isSimbangModalHidden = true
        date = ""
        hymn = ""
        bible = ""
        simbangja = ""
        companion = ""
        detail = ""
        toast.success("저장되었습니다.")
        return await invalidateAll()
      }
    }
  }

  const simbangDeleteHandler = async (simbangId: string) => {
    const response = await fetch(`/api/simbangs/${simbangId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
    return response.ok
  }
</script>

<div
  id="content"
  class="sm:px-16 px-6 flex flex-col w-full bg-white overflow-scroll"
>
  <div class="flex flex-col w-full-if-mobile mb-3">
    <!-- 신상 정보 -->
    <div class="신상 flex flex-col">
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2 z-10"
      >
        <h1 class="text-lg font-medium">
          {seongdo.name}
          {seongdo.jikbun || ""}
        </h1>
        <div class="flex ml-auto gap-2">
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={submitHandler}
          >
            <Checkmark scale={16} />
            <span>저장</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={() => {
              if (!confirm("삭제하시겠습니까?")) {
                return false
              }
              deleteHandler()
            }}
          >
            <TrashCan scale={16} />
            <span>삭제</span>
          </button>

          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              const urlParams = new URLSearchParams(document.location.search)
              const isAfterCreate = urlParams.get("create")
              if (isAfterCreate == "true") {
                goto("/seongdos")
              } else {
                history.back()
              }
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
        </div>
      </div>
      <div class="flex flex-col text-sm gap-3">
        <div class="hidden md:flex gap-3">
          <button
            class="flex flex-none relative"
            on:mouseleave={() => {
              hoverOnAvatar = false
            }}
            on:focus={undefined}
          >
            <label for="photo-dropbox">
              <img
                alt=""
                id="preview"
                src={seongdo.avatar || "/avatar.png"}
                class="border-gray-300 border w-[7.5rem] min-w-[7.5rem] h-[7.5rem] object-cover hover:opacity-75"
                on:mouseover={() => {
                  hoverOnAvatar = true
                }}
                on:focus={undefined}
              />
              <button
                class="absolute right-1.5 bottom-1.5 flex justify-center items-center rounded-full bg-[#F46055] w-7 h-7"
                class:hidden={!hoverOnAvatar || !seongdo.avatar}
                on:click={() => {
                  seongdo.avatar = ""
                }}
              >
                <TrashCan scale={16} color="white" />
              </button>
            </label>
            <input
              id="photo-dropbox"
              type="file"
              accept="image/*"
              class="sr-only"
              on:change={(e) => {
                onFileSelected(e)
              }}
              bind:this={fileinput}
            />
          </button>
          <div class="flex flex-col gap-3 w-full">
            <div class="flex flex-col w-full md:flex-row gap-3">
              <div class="flex w-full h-8 border-gray-300 border">
                <label
                  for="name"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >이름 / 성별</label
                >
                <div class="flex w-full justify-center gap-1 pr-1 bg-gray-50">
                  <input
                    id="name"
                    type="text"
                    bind:value={seongdo.name}
                    required
                    class="flex w-full bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
                  />
                  <div class="border-l border-gray-300" />
                  <select
                    id="gender"
                    value={seongdo.gender}
                    on:change={() => {
                      seongdo.gender = document.querySelector(
                        "#gender > option:checked"
                      ).value
                    }}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <option value="남자">남자</option>
                    <option value="여자">여자</option>
                  </select>
                </div>
              </div>
              <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
                <div class="flex w-full gap-1">
                  <label
                    for="enrolled"
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >등록일자</label
                  >
                  <input
                    id="enrolled"
                    type="date"
                    on:change={(e) => {
                      seongdo.enrolled_at = e.target.value
                    }}
                    class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 pl-1 pr-2 border-gray-300"
                    min="1900-01-01"
                    max="2024-12-31"
                    value={seongdo.enrolled_at}
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full md:flex-row gap-3">
              <div class="flex w-full h-8 border-gray-300 border bg-gray-50">
                <div class="flex w-full gap-1">
                  <label
                    for="name"
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >생일 / 나이</label
                  >
                  <input
                    id="date"
                    type="date"
                    on:change={(e) => {
                      seongdo.birth = e.target.value
                      seongdo.age = getAgeFromBirth(seongdo.birth)
                    }}
                    class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 pl-1 pr-2 border-gray-300 border-r"
                    min="1900-01-01"
                    max="2023-12-31"
                    value={seongdo.birth}
                  />
                  <input
                    id="age"
                    type="text"
                    value={ageWithString}
                    disabled
                    class="flex flex-none w-[2.8rem] text-center bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0"
                  />
                </div>
              </div>
              <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
                <div class="flex w-full gap-1">
                  <label
                    for="name"
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >직분 / 신급</label
                  >
                  <div class="flex w-full justify-center gap-1 pr-1">
                    <select
                      id="jikbun"
                      value={seongdo.jikbun}
                      on:change={() => {
                        seongdo.jikbun = document.querySelector(
                          "#jikbun > option:checked"
                        ).value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="" class="" />
                      <option value="장로">장로</option>
                      <option value="안수집사">안수집사</option>
                      <option value="권사">권사</option>
                      <option value="은퇴권사">은퇴권사</option>
                      <option value="무임권사">무임권사</option>
                      <option value="무임은퇴권사">무임은퇴권사</option>
                      <option value="서리집사">서리집사</option>
                      <option value="은퇴집사">은퇴집사</option>
                      <option value="무임집사">무임집사</option>
                      <option value="무임은퇴집사">무임은퇴집사</option>
                      <option value="권찰">권찰</option>
                      <option value="성도">성도</option>
                    </select>
                    <div class="border-l border-gray-300" />
                    <select
                      id="singeup"
                      value={seongdo.singeup}
                      on:change={() => {
                        seongdo.singeup = document.querySelector(
                          "#singeup > option:checked"
                        ).value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      <option value="세례">세례</option>
                      <option value="입교">입교</option>
                      <option value="학습">학습</option>
                      <option value="유아세례">유아세례</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full md:flex-row gap-3">
              <div class="flex w-full h-8 border-gray-300 border">
                <label
                  for="phone"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >휴대전화</label
                >
                <div class="flex w-full bg-gray-50">
                  <input
                    id="phone"
                    type="text"
                    value={seongdo.phone}
                    class="flex w-full px-2 bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    on:input={(e) => {
                      seongdo.phone = e.target.value
                    }}
                  />
                </div>
              </div>
              <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
                <div class="flex w-full gap-1">
                  <label
                    for="name"
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis hover:opacity-75"
                  >
                    <button
                      on:click={() => {
                        if (groupItem.group1) {
                          goto(
                            `/seongdos${getSearchParams({
                              group1: groupItem.group1,
                              group2: groupItem.group2Add
                                ? groupItem.group2 + "," + groupItem.group2Add
                                : groupItem.group2Add,
                            })}`
                          )
                        }
                      }}
                    >
                      소속
                    </button>
                  </label>
                  <div class="flex w-full justify-center gap-1 pr-1">
                    <select
                      value={groupItem.group1}
                      id="group1"
                      on:change={() => {
                        seongdo.group1 = document.querySelector(
                          "#group1 > option:checked"
                        ).value
                        seongdo.group2 = ""
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      {#each Object.keys(groupList) as group1}
                        <option value={group1}>{group1}</option>
                      {/each}
                      <option value="교역자">교역자</option>
                      <option value="기타">기타</option>
                    </select>
                    <div class="border-l border-gray-300" />

                    <select
                      id="group2"
                      value={groupItem.group2}
                      required
                      on:change={() => {
                        seongdo.group2 = document.querySelector("#group2").value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      {#if seongdo.group1 == "장년부"}
                        {#each groupList["장년부"] as item}
                          <option value={item}>{item}</option>
                        {/each}
                      {:else if seongdo.group1 == "청년부"}
                        {#each groupList["청년부"] as item}
                          <option value={item}>{item}</option>
                        {/each}
                      {:else if seongdo.group1 == "교회학교"}
                        {#each groupList["교회학교"] as item}
                          <option value={item}>{item}</option>
                        {/each}
                      {:else if seongdo.group1 == "교역자"}
                        <option value="담임목사">담임목사</option>
                        <option value="목사">목사</option>
                        <option value="강도사">강도사</option>
                        <option value="전도사">전도사</option>
                        <option value="교육전도사">교육전도사</option>
                      {:else if seongdo.group1 == "기타"}
                        <option value="별명부">별명부</option>
                        <option value="재적">재적</option>
                      {/if}
                    </select>
                    <div
                      class="border-l border-gray-300"
                      class:hidden={seongdo.group1 == "장년부" &&
                      seongdo.group2 != ""
                        ? false
                        : true}
                    />
                    <select
                      id="group2Add"
                      required
                      value={group2Add}
                      on:change={() => {
                        group2Add = document.querySelector("#group2Add").value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                      class:hidden={seongdo.group1 == "장년부" &&
                      seongdo.group2 != ""
                        ? false
                        : true}
                    >
                      <option value="none" class="hidden" />
                      <option value="1구역">1구역</option>
                      <option value="2구역">2구역</option>
                      <option value="3구역">3구역</option>
                      <option value="4구역">4구역</option>
                      <option value="5구역">5구역</option>
                      <option value="6구역">6구역</option>
                      <option value="7구역">7구역</option>
                      <option value="8구역">8구역</option>
                      <option value="9구역">9구역</option>
                      <option value="10구역">10구역</option>
                      <option value="11구역">11구역</option>
                      <option value="12구역">12구역</option>
                      <option value="13구역">13구역</option>
                      <option value="14구역">14구역</option>
                      <option value="15구역">15구역</option>
                      <option value="16구역">16구역</option>
                      <option value="17구역">17구역</option>
                      <option value="18구역">18구역</option>
                      <option value="19구역">19구역</option>
                      <option value="20구역">20구역</option>
                      <option value="21구역">21구역</option>
                      <option value="22구역">22구역</option>
                      <option value="23구역">23구역</option>
                      <option value="24구역">24구역</option>
                      <option value="25구역">25구역</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="md:hidden flex flex-col gap-3">
          <div class="flex gap-3">
            <div class="flex flex-none">
              <label for="photo-dropbox">
                <img
                  alt=""
                  id="previewM"
                  src={seongdo.avatar || "/avatar.png"}
                  class="border-gray-300 border w-[7.5rem] min-w-[7.5rem] h-[7.5rem] object-cover hover:opacity-75"
                />
              </label>
              <input
                id="photo-dropbox"
                type="file"
                accept="image/*"
                class="sr-only"
                on:change={(e) => {
                  onFileSelected(e)
                }}
                bind:this={fileinput}
              />
            </div>
            <div class="flex flex-col gap-3 w-full">
              <div class="flex w-full h-8 border-gray-300 border">
                <label
                  for="name"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >이름</label
                >
                <input
                  id="name"
                  type="text"
                  bind:value={seongdo.name}
                  required
                  class="flex w-full bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
                />
              </div>
              <div class="flex w-full h-8 border-gray-300 border">
                <label
                  for="genderM"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >성별</label
                >
                <div class="flex w-full bg-gray-50 px-1">
                  <select
                    id="genderM"
                    value={seongdo.gender}
                    on:change={() => {
                      seongdo.gender = document.querySelector(
                        "#genderM > option:checked"
                      ).value
                    }}
                    class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <option value="남자">남자</option>
                    <option value="여자">여자</option>
                  </select>
                </div>
              </div>
              <div class="flex w-full h-8 border-gray-300 border">
                <label
                  for="age"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >나이</label
                >
                <div class="flex w-full bg-gray-50 px-1">
                  <input
                    id="age"
                    type="text"
                    value={ageWithString}
                    disabled
                    class="flex flex-none w-[2.8rem] text-center bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col w-full gap-3">
            <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
              <div class="flex w-full gap-1">
                <label
                  for="birthM"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >생일</label
                >
                <input
                  id="birthM"
                  type="date"
                  on:change={(e) => {
                    seongdo.birth = e.target.value
                    seongdo.age = getAgeFromBirth(seongdo.birth)
                  }}
                  class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 border-gray-300 px-1"
                  min="1900-01-01"
                  max="2023-12-31"
                  value={seongdo.birth}
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full gap-3">
            <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
              <div class="flex w-full gap-1">
                <label
                  for="erolledM"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >등록일자</label
                >
                <input
                  id="erolledM"
                  type="date"
                  on:change={(e) => {
                    seongdo.enrolled_at = e.target.value
                  }}
                  class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 border-gray-300 px-1"
                  min="1900-01-01"
                  max="2023-12-31"
                  value={seongdo.enrolled_at}
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full gap-3">
            <div class="flex w-full h-8 border-gray-300 border">
              <label
                for="phoneM"
                class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >휴대전화</label
              >
              <div class="flex w-full bg-gray-50 px-1">
                <input
                  id="phoneM"
                  type="text"
                  value={seongdo.phone}
                  on:input={(e) => {
                    seongdo.phone = e.target.value
                  }}
                  class="flex w-full px-1 bg-gray-50 text-gray-900 text-sm focus:outline-0"
                />
              </div>
            </div>

            <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
              <div class="flex w-full gap-1">
                <label
                  for="jikbunM"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >직분 / 신급</label
                >
                <div class="flex w-full justify-center gap-1 pr-1">
                  <select
                    id="jikbunM"
                    on:change={() => {
                      seongdo.jikbun = document.querySelector(
                        "#jikbunM > option:checked"
                      ).value
                    }}
                    value={seongdo.jikbun}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <option value="장로">장로</option>
                    <option value="안수집사">안수집사</option>
                    <option value="권사">권사</option>
                    <option value="은퇴권사">은퇴권사</option>
                    <option value="무임권사">무임권사</option>
                    <option value="무임은퇴권사">무임은퇴권사</option>
                    <option value="서리집사">서리집사</option>
                    <option value="은퇴집사">은퇴집사</option>
                    <option value="무임집사">무임집사</option>
                    <option value="무임은퇴집사">무임은퇴집사</option>
                    <option value="권찰">권찰</option>
                    <option value="성도">성도</option>
                  </select>
                  <div class="border-l border-gray-300" />
                  <select
                    id="singeupM"
                    value={seongdo.singeup}
                    on:change={() => {
                      seongdo.singeup = document.querySelector(
                        "#singeupM > option:checked"
                      ).value
                    }}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <option value="세례">세례</option>
                    <option value="입교">입교</option>
                    <option value="학습">학습</option>
                    <option value="유아세례">유아세례</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
              <div class="flex w-full gap-1">
                <label
                  for="group1M"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >
                  <button
                    on:click={() => {
                      if (groupItem.group1) {
                        goto(
                          encodeURI(
                            `/seongdos${getSearchParams({
                              group1: groupItem.group1,
                              group2: groupItem.group2Add
                                ? groupItem.group2 + "," + groupItem.group2Add
                                : groupItem.group2Add,
                            })}`
                          )
                        )
                      }
                    }}
                  >
                    소속
                  </button>
                </label>
                <div class="flex w-full justify-center gap-1 pr-1">
                  <select
                    id="group1M"
                    value={groupItem.group1}
                    on:change={() => {
                      seongdo.group1 = document.querySelector(
                        "#group1M > option:checked"
                      ).value
                      seongdo.group2 = ""
                    }}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    {#each Object.keys(groupList) as group1}
                      <option value={group1}>{group1}</option>
                    {/each}
                    <option value="교역자">교역자</option>
                    <option value="기타">기타</option>
                  </select>
                  <div class="border-l border-gray-300" />

                  <select
                    id="group2M"
                    value={groupItem.group2}
                    required
                    on:change={() => {
                      seongdo.group2 = document.querySelector("#group2M").value
                    }}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    {#if seongdo.group1 == "장년부"}
                      {#each groupList["장년부"] as item}
                        <option value={item}>{item}</option>
                      {/each}
                    {:else if seongdo.group1 == "청년부"}
                      {#each groupList["청년부"] as item}
                        <option value={item}>{item}</option>
                      {/each}
                    {:else if seongdo.group1 == "교회학교"}
                      {#each groupList["교회학교"] as item}
                        <option value={item}>{item}</option>
                      {/each}
                    {:else if seongdo.group1 == "교역자"}
                      <option value="담임목사">담임목사</option>
                      <option value="목사">목사</option>
                      <option value="강도사">강도사</option>
                      <option value="전도사">전도사</option>
                      <option value="교육전도사">교육전도사</option>
                    {:else if seongdo.group1 == "기타"}
                      <option value="별명부">별명부</option>
                      <option value="재적">재적</option>
                    {/if}
                  </select>
                  <div
                    class="border-l border-gray-300"
                    class:hidden={seongdo.group1 == "장년부" &&
                    seongdo.group2 != ""
                      ? false
                      : true}
                  />
                  <select
                    id="group2MAdd"
                    required
                    value={groupItem.group2Add}
                    on:change={() => {
                      group2Add = document.querySelector("#group2MAdd").value
                    }}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    class:hidden={seongdo.group1 == "장년부" &&
                    seongdo.group2 != ""
                      ? false
                      : true}
                  >
                    <option value="none" class="hidden" />
                    <option value="1구역">1구역</option>
                    <option value="2구역">2구역</option>
                    <option value="3구역">3구역</option>
                    <option value="4구역">4구역</option>
                    <option value="5구역">5구역</option>
                    <option value="6구역">6구역</option>
                    <option value="7구역">7구역</option>
                    <option value="8구역">8구역</option>
                    <option value="9구역">9구역</option>
                    <option value="10구역">10구역</option>
                    <option value="11구역">11구역</option>
                    <option value="12구역">12구역</option>
                    <option value="13구역">13구역</option>
                    <option value="14구역">14구역</option>
                    <option value="15구역">15구역</option>
                    <option value="16구역">16구역</option>
                    <option value="17구역">17구역</option>
                    <option value="18구역">18구역</option>
                    <option value="19구역">19구역</option>
                    <option value="20구역">20구역</option>
                    <option value="21구역">21구역</option>
                    <option value="22구역">22구역</option>
                    <option value="23구역">23구역</option>
                    <option value="24구역">24구역</option>
                    <option value="25구역">25구역</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-auto h-8 border-gray-300 border-x border-y">
          <div
            class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >
            주소
          </div>

          <input
            id="address"
            autocomplete="off"
            value={addressWithExtraAddress}
            on:input={(e) => {
              addressWithExtraAddress = e.target.value
            }}
            class="flex w-full justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
            on:click={searchAddress}
          />
        </div>
        <div class="flex h-8 flex-auto border-gray-300 border-x border-y">
          <div
            class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >
            상세주소
          </div>

          <input
            id="detailAddress"
            autocomplete="off"
            value={detailAddress}
            on:input={(e) => {
              detailAddress = e.target.value
            }}
            type="text"
            class="flex justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
          />
        </div>
        <div class="flex h-24 flex-auto border-gray-300 border-x border-y">
          <div
            class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >
            특이사항
          </div>

          <textarea
            value={family
              ? family.detail
              : seongdo.remarks
                ? seongdo.remarks
                : ""}
            on:input={(e) => {
              if (family) {
                family.detail = e.target.value
              } else {
                seongdo.remarks = e.target.value
              }
            }}
            class="resize-none flex justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
          />
        </div>
      </div>
    </div>
    <!-- 봉사 내용 -->
    <div class="섬김사역 flex flex-col">
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2"
      >
        <h1 class="text-lg font-medium">섬김 사역</h1>
        <div class="flex ml-auto gap-2">
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={() => {
              isServiceModalHidden = !isServiceModalHidden
            }}
          >
            <AddLarge scale={16} />
            <span>내용 추가</span>
          </button>
        </div>
      </div>
      <div class="flex text-sm border-l overflow-scroll">
        <div
          class="flex flex-col w-full whitespace-nowrap border-r divide-y border-b"
        >
          <div
            class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
          >
            소속
          </div>
          {#if seongdo.services?.length > 0}
            <!-- content here -->
            {#each seongdo.services as service}
              <div class="flex justify-center px-2 items-center h-10">
                {getGroupString(service.group1, service.group2, true)}
              </div>
            {/each}
          {/if}
        </div>
        <div
          class="flex flex-col whitespace-nowrap min-w-[30%] divide-y border-b"
        >
          <div
            class="flex justify-center gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          >
            구분
          </div>
          {#if seongdo.services?.length > 0}
            <!-- content here -->
            {#each seongdo.services as service}
              <button class="flex px-3 items-center justify-center h-10">
                <div class="flex justify-center px-2 items-center h-10">
                  {service.classification}
                </div>
              </button>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <button
            class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          />
          {#if seongdo.services?.length > 0}
            {#each seongdo.services as service}
              <div class="flex items-center px-3 h-10">
                <button
                  type="button"
                  class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
                  on:click={async () => {
                    seongdo.services = seongdo.services.filter(
                      (item) =>
                        item.group1 + item.group2 + item.classification !=
                        service.group1 + service.group2 + service.classification
                    )
                    await submitHandler()
                  }}
                >
                  <TrashCan fill="#4a4a4a" size={20} />
                </button>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
    <!-- 가족 관계 -->
    <div class="가족관계 flex flex-col">
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2"
      >
        <h1 class="text-lg font-medium">가족관계</h1>
        <div class="flex ml-auto gap-2">
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={() => {
              isFamilyModalHidden = !isFamilyModalHidden
              $SeongdosStore = []
              if (!familyId) {
                selectedSeongdo = seongdo
              }
            }}
          >
            <AddLarge scale={16} />
            <span>가족 추가</span>
          </button>
        </div>
      </div>
      <div class="flex text-sm border-l overflow-scroll">
        <!-- <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <div
            class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
          >
            사진
          </div>

          {#if members?.length > 0}
            {#each members as member}
              <div class="flex justify-center items-center h-10">
                <img
                  class="mx-auto object-cover w-8 h-8"
                  src={member.seongdo?.avatarVercelBlob || "/avatar.png"}
                  alt=""
                />
              </div>
            {/each}
          {/if}
        </div> -->

        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <div
            class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
          >
            구분
          </div>
          {#if members?.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-2 items-center h-10">
                {member.classification}
              </div>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <div
            class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          >
            이름
          </div>
          {#if members?.length > 0}
            <!-- content here -->
            {#each members as member}
              <button
                class="flex px-3 items-center h-10"
                on:click={() => {
                  if (member.isSeongdo) {
                    if (
                      !isAllowGroup(
                        $AllowedGroupStore,
                        member.seongdo.group1,
                        member.seongdo.group2
                      )
                    ) {
                      toast.error("접근할 수 없습니다.")
                    } else {
                      goto(`/seongdos/${member.seongdo.name}`)
                    }
                  } else {
                    selectedNonSeongdoFamily = member
                    isFamilyModalHidden = !isFamilyModalHidden
                  }
                }}
              >
                <div>
                  {member.isSeongdo ? member.seongdo.name : member.name}
                </div>
              </button>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <button
            class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          >
            직분
          </button>
          {#if members?.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex px-3 justify-center items-center h-10">
                {member.isSeongdo ? member.seongdo.jikbun : ""}
              </div>
            {/each}
          {/if}
        </div>
        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 생년월일 </button>
          {#if members?.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-3 items-center h-10">
                {member.isSeongdo ? member.seongdo.birth : member.birth}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 핸드폰 </button>
          {#if members?.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-3 items-center h-10">
                {member.isSeongdo ? member.seongdo.phone : member.phone}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto whitespace-nowrap divide-y border-b"
        >
          <div
            class="flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
          >
            소속
          </div>
          {#if members?.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-3 items-center h-10">
                {member.isSeongdo
                  ? getGroupString(member.seongdo.group1, member.seongdo.group2)
                  : "미등록"}
              </div>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <button
            class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          />
          {#if members?.length > 0}
            {#each members as member}
              <div class="flex items-center px-3 h-10">
                <button
                  type="button"
                  class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
                  on:click={async () => {
                    if (member.isSeongdo) {
                      memberIds = memberIds.filter(
                        (id) => id != member.seongdo._id
                      )

                      if (member.seongdo == seongdo._id) {
                        members = members.filter(
                          (seongdo) => seongdo.isSeongdo == true
                        )
                      } else {
                        members = members.filter(
                          (seongdo) => seongdo.seongdo != member.seongdo
                        )
                      }
                    } else {
                      members = members.filter(
                        (seongdo) => seongdo.name != member.name
                      )
                    }
                    await familyHandler()
                  }}
                >
                  <TrashCan fill="#4a4a4a" size={20} />
                </button>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
    <!-- 심방 내역 -->
    <div class="심방내역 flex flex-col">
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2"
      >
        <h1 class="text-lg font-medium">심방내역</h1>
        <div class="flex ml-auto gap-2">
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={() => {
              isSimbangModalHidden = !isSimbangModalHidden
            }}
          >
            <AddLarge scale={16} />
            <span>심방 생성</span>
          </button>
        </div>
      </div>
      <div class="flex text-sm border-l overflow-scroll">
        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 날짜 </button>
          {#if simbangs.length > 0}
            <!-- content here -->
            {#each simbangs as simbang}
              <button
                class="flex justify-center px-3 items-center h-10"
                on:click={() => {
                  selectedSimbang = simbang
                  date = simbang.date
                  hymn = simbang.hymn
                  bible = simbang.bible
                  simbangja = simbang.simbangja
                  companion = simbang.companion
                  detail = simbang.detail
                  isSimbangModalHidden = !isSimbangModalHidden
                }}
              >
                {simbang.date}
              </button>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 찬송 </button>
          {#if simbangs.length > 0}
            <!-- content here -->
            {#each simbangs as simbang}
              <div class="flex justify-center px-3 items-center h-10">
                {simbang.hymn}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 말씀 </button>
          {#if simbangs.length > 0}
            <!-- content here -->
            {#each simbangs as simbang}
              <div class="flex justify-center px-3 items-center h-10">
                {simbang.bible}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]">심방자 </button>
          {#if simbangs.length > 0}
            <!-- content here -->
            {#each simbangs as simbang}
              <div class="flex justify-center px-3 items-center h-10">
                {simbang.simbangja}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto whitespace-nowrap divide-y border-b"
        >
          <div
            class="flex justify-center px-3 bg-[#D9D9D8] font-bold items-center h-10"
          >
            내용
          </div>
          {#if simbangs.length > 0}
            <!-- content here -->
            {#each simbangs as simbang}
              <div class="flex px-3 items-center h-10">
                <p class="text-ellipsis overflow-hidden">
                  {textShortenWithEllipsis(simbang.detail, 50)}
                </p>
              </div>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <button
            class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          />
          {#if simbangs.length > 0}
            {#each simbangs as simbang}
              <div class="flex items-center px-3 h-10">
                <button
                  type="button"
                  class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
                  on:click={async () => {
                    const result = await simbangDeleteHandler(simbang._id)
                    if (result) {
                      simbangs = simbangs.filter(
                        (item) => item._id != simbang._id
                      )
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
    </div>
    <!-- 수강 내역 -->
    <div class="수강내역 flex flex-col mb-8">
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2"
      >
        <h1 class="text-lg font-medium">수강내역</h1>
      </div>
      <div class="flex text-sm border-l overflow-scroll">
        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <div
            class="flex justify-center items-center px-3 font-bold h-10 bg-[#D9D9D8]"
          >
            교육 이름
          </div>

          {#if seongdoEdus.length > 0}
            <!-- content here -->
            {#each seongdoEdus as seongdoEdu}
              <button
                class="flex justify-center px-3 items-center h-10"
                on:click={() => {
                  goto(
                    `/educations/detail/${getEduSlug(
                      seongdoEdu.education.name,
                      seongdoEdu.education.semester,
                      seongdoEdu.education.startDate,
                      seongdoEdu.education.day,
                      seongdoEdu.education.time
                    )}`
                  )
                }}
              >
                {seongdoEdu.education.name}
              </button>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <div
            class="flex justify-center items-center px-3 font-bold h-10 bg-[#D9D9D8]"
          >
            학기
          </div>
          {#if seongdoEdus.length > 0}
            <!-- content here -->
            {#each seongdoEdus as seongdoEdu}
              <div class="flex justify-center px-3 items-center h-10">
                {seongdoEdu.education.semester}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <div
            class="flex justify-center items-center px-3 font-bold h-10 bg-[#D9D9D8]"
          >
            강사
          </div>
          {#if seongdoEdus.length > 0}
            <!-- content here -->
            {#each seongdoEdus as seongdoEdu}
              <div class="flex justify-center px-3 items-center h-10">
                {seongdoEdu.education.teacher}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-auto whitespace-nowrap divide-y border-r border-b"
        >
          <div
            class="flex justify-center items-center px-3 font-bold h-10 bg-[#D9D9D8]"
          >
            교육 기간
          </div>
          {#if seongdoEdus.length > 0}
            <!-- content here -->
            {#each seongdoEdus as seongdoEdu}
              <div class="flex justify-center px-3 items-center h-10">
                <p class="whitespace-nowrap truncate">
                  {`${seongdoEdu.education.startDate} ~ ${seongdoEdu.education.endDate}`}
                </p>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<div
  class="relative z-10 h-full"
  class:hidden={isFamilyModalHidden}
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
        {#if selectedSeongdo}
          <div
            class="overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
          >
            <div class="flex flex-col gap-3 text-sm">
              <div class="flex gap-3">
                <div class="flex flex-none">
                  <img
                    alt=""
                    id="previewForFamily"
                    src={selectedSeongdo?.avatar || "/avatar.png"}
                    class="border-gray-300 border w-[7.5rem] min-w-[7.5rem] h-[7.5rem] object-cover"
                  />
                </div>
                <div class="flex flex-col gap-3 w-full">
                  <div class="flex w-full h-8 border-gray-300 border">
                    <div
                      class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >
                      이름
                    </div>
                    <p
                      class="flex w-full bg-gray-50 text-gray-900 p-2 items-center"
                    >
                      {selectedSeongdo.name}
                    </p>
                  </div>
                  <div class="flex w-full h-8 border-gray-300 border">
                    <div
                      class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >
                      생년월일
                    </div>
                    <p
                      class="flex w-full bg-gray-50 text-gray-900 p-2 items-center"
                    >
                      {selectedSeongdo.birth}
                    </p>
                  </div>
                  <div class="flex w-full h-8 border-gray-300 border">
                    <div
                      class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >
                      구분
                    </div>
                    <div class="flex w-full bg-gray-50 px-1">
                      <select
                        id="classification"
                        class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                        class:hidden={classification == "직접입력"}
                        on:change={() => {
                          classification = document.querySelector(
                            "#classification > option:checked"
                          ).value
                        }}
                      >
                        <option value="none" class="hidden" />
                        <option value="직접입력">직접입력</option>
                        {#each familyClassList as familyClass}
                          <option value={familyClass}>{familyClass}</option>
                        {/each}
                      </select>
                      <input
                        placeholder="직접입력"
                        class="flex w-full bg-gray-50 text-gray-900 py-2 px-1 items-center focus:outline-0"
                        class:hidden={classification != "직접입력"}
                        bind:value={classificationValue}
                        on:focusout={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
          >
            <button
              class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
              on:click={async () => {
                if (familyId) {
                  selectedSeongdo = null
                } else {
                  isFamilyModalHidden = !isFamilyModalHidden
                }
              }}
            >
              <span class="flex items-center">
                <Close class="text-[#F46055]" />
                <p>뒤로</p>
              </span>
            </button>
            <button
              class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
              on:click={async () => {
                if (
                  classification == "" ||
                  (classification == "직접입력" && classificationValue == "")
                ) {
                  return toast.error("구분을 입력해주세요.")
                }

                members = [
                  ...members,
                  {
                    seongdo: selectedSeongdo,
                    classification: classificationValue || classification,
                    isSeongdo: true,
                  },
                ]
                memberIds = [...memberIds, selectedSeongdo?._id]
                familyDetail = familyDetail
                  ? familyDetail + "\n\n" + selectedSeongdo?.remarks
                  : selectedSeongdo?.remarks
                    ? selectedSeongdo?.remarks
                    : ""

                const result = await familyHandler()
                if (result) {
                  selectedSeongdo = null
                  isFamilyModalHidden = !isFamilyModalHidden
                  classification = ""
                  classificationValue = ""
                  toast.success("추가되었습니다.")
                }
              }}
            >
              <AddLarge scale={16} />
              <span>추가</span>
            </button>
          </div>
        {:else if selectedNonSeongdoFamily}
          <div
            class="overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
          >
            <form class="flex flex-col">
              <div class="flex flex-col text-sm gap-3">
                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyName"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >이름</label
                  >
                  <div
                    class="flex flex-auto justify-start bg-gray-50 pl-1.5 pr-1"
                  >
                    <input
                      id="familyName"
                      type="text"
                      bind:value={selectedNonSeongdoFamily.name}
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>
                <div class="flex w-full h-8 border-gray-300 border">
                  <div
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >
                    구분
                  </div>
                  <div class="flex w-full bg-gray-50 px-1">
                    <input
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                      value={selectedNonSeongdoFamily.classification}
                      disabled
                    />
                  </div>
                </div>
                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyGender"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >성별</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50 pr-1">
                    <input
                      class="px-1 flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                      value={selectedNonSeongdoFamily.gender}
                      disabled
                    />
                  </div>
                </div>
                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyBirth"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >생년월일</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50">
                    <input
                      id="familyBirth"
                      type="date"
                      value={selectedNonSeongdoFamily.birth}
                      disabled
                      class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>

                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyBirth"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >나이</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50">
                    <input
                      id="age"
                      type="text"
                      value={selectedNonSeongdoFamily.birth
                        ? getAgeFromBirth(selectedNonSeongdoFamily.birth) + "세"
                        : ""}
                      disabled
                      class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>

                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyPhone"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >핸드폰</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50">
                    <input
                      id="familyPhone"
                      type="text"
                      value={selectedNonSeongdoFamily.phone}
                      disabled
                      class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div
            class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
          >
            <button
              class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
              on:click={async () => {
                selectedNonSeongdoFamily = null
                isFamilyModalHidden = !isFamilyModalHidden
              }}
            >
              <span class="flex items-center">
                <Close class="text-[#F46055]" />
                <p>뒤로</p>
              </span>
            </button>
            <button
              class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            >
              <Checkmark scale={16} />
              <span>저장</span>
            </button>
            <button
              class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
              on:click={async () => {
                let response = await fetch(
                  `/api/seongdos/${selectedNonSeongdoFamily?.name.trim()}`,
                  {
                    headers: {
                      "content-type": "application/json",
                    },
                  }
                )
                const { seongdo } = await response.json()
                if (seongdo) {
                  toast.error("이미 등록된 이름은 사용할 수 없습니다.")
                } else {
                  response = await fetch("/api/seongdos", {
                    method: "POST",
                    body: JSON.stringify({
                      name: selectedNonSeongdoFamily?.name,
                      gender: selectedNonSeongdoFamily?.gender,
                      birth: selectedNonSeongdoFamily?.birth,
                      phone: selectedNonSeongdoFamily?.phone,
                      originalName: selectedNonSeongdoFamily?.name.trim(),
                      avatar: "",
                      jikbun: "",
                      group1: "",
                      group2: "",
                      singeup: "",
                      address: "",
                      enrolled_at: "",
                    }),
                    headers: {
                      "content-type": "application/json",
                    },
                  })
                  if (response.ok) {
                    const { seongdo } = await response.json()
                    memberIds = [...memberIds, seongdo._id]
                    members = members.map((item) => {
                      if (item.name == selectedNonSeongdoFamily?.name) {
                        return {
                          isSeongdo: true,
                          seongdo: seongdo._id,
                          classification:
                            selectedNonSeongdoFamily?.classification,
                        }
                      } else {
                        return item
                      }
                    })
                    isFamilyModalHidden = true
                    selectedNonSeongdoFamily = null
                    await familyHandler()
                    toast.success("성도로 등록되었습니다.")
                  }
                }
              }}
            >
              <AddLarge scale={16} />
              <span>성도로 등록</span>
            </button>
          </div>
        {:else if addNonSeongdo}
          <div
            class="overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
          >
            <h1 class="text-left text-lg font-medium mb-2">
              가족관계 직접추가
            </h1>
            <form class="flex flex-col">
              <div class="flex flex-col text-sm gap-3">
                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyName"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >이름</label
                  >
                  <div
                    class="flex flex-auto justify-start bg-gray-50 pl-1.5 pr-1"
                  >
                    <input
                      id="familyName"
                      type="text"
                      bind:value={addedName}
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>
                <div class="flex w-full h-8 border-gray-300 border">
                  <div
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >
                    구분
                  </div>
                  <div class="flex w-full bg-gray-50 px-1">
                    <select
                      id="classificationForAdd"
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                      class:hidden={classification == "직접입력"}
                      on:change={() => {
                        classification = document.querySelector(
                          "#classificationForAdd > option:checked"
                        ).value
                      }}
                    >
                      <option value="none" class="hidden" />
                      <option value="직접입력">직접입력</option>
                      {#each familyClassList as familyClass}
                        <option value={familyClass}>{familyClass}</option>
                      {/each}
                    </select>
                    <input
                      placeholder="직접입력"
                      class="flex w-full bg-gray-50 text-gray-900 py-2 px-1 items-center focus:outline-0"
                      class:hidden={classification != "직접입력"}
                      bind:value={classificationValue}
                      on:focusout={() => {}}
                    />
                  </div>
                </div>
                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyGender"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >성별</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50 pr-1">
                    <select
                      id="familyGender"
                      class="px-1 flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                      on:change={() => {
                        addedGender = document.querySelector(
                          "#familyGender > option:checked"
                        ).value
                      }}
                      value={addedGender}
                    >
                      <option value="none" class="hidden" />
                      <option value="남자">남자</option>
                      <option value="여자">여자</option>
                    </select>
                  </div>
                </div>
                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyBirth"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >생년월일</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50">
                    <input
                      id="familyBirth"
                      type="date"
                      bind:value={addedBirth}
                      class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>

                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyBirth"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >나이</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50">
                    <input
                      id="age"
                      type="text"
                      value={addedBirth
                        ? getAgeFromBirth(addedBirth) + "세"
                        : ""}
                      disabled
                      class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>

                <div class="flex w-full h-8 border-gray-300 border-x border-y">
                  <label
                    for="familyPhone"
                    class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >핸드폰</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50">
                    <input
                      id="familyPhone"
                      type="text"
                      bind:value={addedPhone}
                      class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div
            class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
          >
            <button
              class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
              class:hidden={!addNonSeongdo}
              on:click={async () => {
                addNonSeongdo = false
              }}
            >
              <span class="flex items-center">
                <Close class="text-[#F46055]" />
                <p>뒤로</p>
              </span>
            </button>
            <button
              class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
              class:hidden={!addNonSeongdo}
              on:click={async () => {
                if (addedName == "") {
                  return toast.error("이름을 입력해주세요.")
                } else if (
                  classification == "" ||
                  (classification == "직접입력" && classificationValue == "")
                ) {
                  return toast.error("구분을 입력해주세요.")
                }

                members = [
                  ...members,
                  {
                    seongdo: null,
                    classification: classificationValue || classification,
                    isSeongdo: false,
                    name: addedName,
                    gender: addedGender,
                    birth: addedBirth,
                    phone: addedPhone,
                  },
                ]
                const result = await familyHandler()
                if (result) {
                  selectedSeongdo = null
                  isFamilyModalHidden = !isFamilyModalHidden
                  classification = ""
                  classificationValue = ""
                  addNonSeongdo = !addNonSeongdo
                  searchName = ""
                  addedName = ""
                  addedGender = ""
                  addedBirth = ""
                  addedPhone = ""
                  toast.success("추가되었습니다.")
                }
              }}
            >
              <AddLarge scale={16} />
              <span>추가</span>
            </button>
          </div>
        {:else if $SeongdosStore.length > 0}
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
            <SearchTable {familyAddHandler} />
          </div>
          <div
            class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
          >
            <button
              class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
              on:click={async () => {
                isFamilyModalHidden = !isFamilyModalHidden
                searchName = ""
              }}
            >
              <span class="flex items-center">
                <Close class="text-[#F46055]" />
                <p>닫기</p>
              </span>
            </button>
            <button
              class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
              on:click={() => {
                addNonSeongdo = true
              }}
            >
              <AddLarge scale={16} />
              <span>직접 추가</span>
            </button>
          </div>
        {:else}
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
          </div>
          <div
            class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
          >
            <button
              class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
              on:click={async () => {
                isFamilyModalHidden = !isFamilyModalHidden
                searchName = ""
              }}
            >
              <span class="flex items-center">
                <Close class="text-[#F46055]" />
                <p>닫기</p>
              </span>
            </button>
            <button
              class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
              on:click={() => {
                addNonSeongdo = true
              }}
            >
              <AddLarge scale={16} />
              <span>직접 추가</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<div
  class="relative z-10 h-full"
  class:hidden={isSimbangModalHidden}
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
          class="w-full h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
        >
          {#if selectedSimbang}
            <h1 class="text-left text-lg font-medium mb-2">심방 내용</h1>
          {:else}
            <h1 class="text-left text-lg font-medium mb-2">심방 생성</h1>
          {/if}

          <div class="flex flex-col h-[calc(100%-30px)] text-sm gap-3">
            <div class="flex w-full h-8 border-gray-300 border-x border-y">
              <label
                for="simbangDate"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >심방 날짜</label
              >
              <div class="flex flex-auto justify-start bg-gray-50 pl-1.5 pr-1">
                <input
                  id="simbangDate"
                  type="date"
                  bind:value={date}
                  class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                />
              </div>
            </div>
            <div class="flex w-full h-8 border-gray-300 border-x border-y">
              <label
                for="simbangSimbangja"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >심방자</label
              >
              <div class="flex flex-auto justify-start bg-gray-50 pr-1">
                <select
                  id="simbangSimbangja"
                  class="px-1 flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  on:change={() => {
                    simbangja = document.querySelector(
                      "#simbangSimbangja > option:checked"
                    ).value
                  }}
                  value={simbangja}
                >
                  <option value="none" class="hidden" />
                  {#each teacherList as teacher}
                    <option value={teacher}>{teacher}</option>
                  {/each}
                </select>
              </div>
            </div>
            <div class="flex w-full h-8 border-gray-300 border-x border-y">
              <label
                for="simbangCompanion"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >동행자</label
              >
              <div class="flex flex-col flex-auto justify-start bg-gray-50">
                <input
                  id="simbangCompanion"
                  type="text"
                  bind:value={companion}
                  class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                />
              </div>
            </div>
            <div class="flex w-full h-8 border-gray-300 border-x border-y">
              <label
                for="simbangHymn"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >찬송</label
              >
              <div class="flex flex-auto justify-start bg-gray-50">
                <input
                  id="simbangHymn"
                  type="text"
                  bind:value={hymn}
                  class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                />
              </div>
            </div>

            <div class="flex w-full h-8 border-gray-300 border-x border-y">
              <label
                for="simbangBible"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >말씀</label
              >
              <div class="flex flex-auto justify-start bg-gray-50">
                <input
                  id="simbangBible"
                  type="text"
                  bind:value={bible}
                  class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                />
              </div>
            </div>

            <div
              class="flex w-full flex-auto items-stretch border-gray-300 border-x border-y"
            >
              <label
                for="simbangDetail"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >내용</label
              >
              <div class="flex flex-auto justify-start bg-gray-50">
                <textarea
                  id="simbangDetail"
                  bind:value={detail}
                  class="resize-none flex justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
        >
          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              isSimbangModalHidden = !isSimbangModalHidden
              selectedSimbang = null
              date = ""
              hymn = ""
              bible = ""
              companion = ""
              simbangja = ""
              detail = ""
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={async () => {
              if (selectedSimbang) {
                const result = await simbangHandler()
              } else {
                const result = await simbangHandler()
              }
            }}
          >
            <Checkmark scale={16} />
            <span>저장</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<div
  class="relative z-10 h-full"
  class:hidden={isServiceModalHidden}
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
          class="w-full overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
        >
          <h1 class="text-left text-lg font-medium mb-2">사역 추가</h1>

          <form class="flex flex-col">
            <div class="flex flex-col text-sm gap-3">
              <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
                <div class="flex w-full gap-1">
                  <label
                    for="group1ForService"
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >소속</label
                  >
                  <div class="flex w-full justify-center gap-1 pr-1">
                    <select
                      value={groupItemForService.group1}
                      id="group1ForService"
                      on:change={() => {
                        service.group1 = document.querySelector(
                          "#group1ForService > option:checked"
                        ).value
                        service.group2 = ""
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      <option value="장년부">장년부</option>
                      <option value="청년부">청년부</option>
                      <option value="교회학교">교회학교</option>
                    </select>
                    <div class="border-l border-gray-300" />

                    <select
                      id="group2ForService"
                      value={groupItemForService.group2}
                      on:change={() => {
                        service.group2 =
                          document.querySelector("#group2ForService").value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      {#if service?.group1 == "장년부"}
                        <option value="1교구">1교구</option>
                        <option value="2교구">2교구</option>
                        <option value="3교구">3교구</option>
                      {:else if service?.group1 == "청년부"}
                        <option value="1청년">1청년</option>
                        <option value="2청년">2청년</option>
                      {:else if service?.group1 == "교회학교"}
                        <option value="영아부">영아부</option>
                        <option value="유치부">유치부</option>
                        <option value="유년부">유년부</option>
                        <option value="초등부">초등부</option>
                        <option value="중등부">중등부</option>
                        <option value="고등부">고등부</option>
                        <option value="은혜브릿지">은혜브릿지</option>
                        <option value="늘푸른부">늘푸른부</option>
                      {/if}
                    </select>
                    <div
                      class="border-l border-gray-300"
                      class:hidden={service?.group1 == "장년부" &&
                      service?.group2 != ""
                        ? false
                        : true}
                    />
                    <select
                      id="group2AddForService"
                      value={group2AddForService}
                      on:change={() => {
                        group2AddForService = document.querySelector(
                          "#group2AddForService"
                        ).value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                      class:hidden={service?.group1 == "장년부" &&
                      service?.group2 != ""
                        ? false
                        : true}
                    >
                      <option value="none" class="hidden" />
                      <option value="1구역">1구역</option>
                      <option value="2구역">2구역</option>
                      <option value="3구역">3구역</option>
                      <option value="4구역">4구역</option>
                      <option value="5구역">5구역</option>
                      <option value="6구역">6구역</option>
                      <option value="7구역">7구역</option>
                      <option value="8구역">8구역</option>
                      <option value="9구역">9구역</option>
                      <option value="10구역">10구역</option>
                      <option value="11구역">11구역</option>
                      <option value="12구역">12구역</option>
                      <option value="13구역">13구역</option>
                      <option value="14구역">14구역</option>
                      <option value="15구역">15구역</option>
                      <option value="16구역">16구역</option>
                      <option value="17구역">17구역</option>
                      <option value="18구역">18구역</option>
                      <option value="19구역">19구역</option>
                      <option value="20구역">20구역</option>
                      <option value="21구역">21구역</option>
                      <option value="22구역">22구역</option>
                      <option value="23구역">23구역</option>
                      <option value="24구역">24구역</option>
                      <option value="25구역">25구역</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
                <div class="flex w-full gap-1">
                  <label
                    for="group1ForService"
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >구분</label
                  >
                  <div class="flex flex-auto justify-start bg-gray-50">
                    <input
                      id="classificationForService"
                      type="text"
                      bind:value={service.classification}
                      class="px-2 flex flex-auto w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div
          class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
        >
          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              isServiceModalHidden = !isServiceModalHidden
              service.group1 = ""
              service.group2 = ""
              service.classification = ""
              group2AddForService = ""
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={async () => {
              if (!service.group1) {
                toast.error("소속을 입력해주세요.")
              } else if (!service.classification) {
                toast.error("구분을 입력해주세요.")
              } else {
                let order
                switch (service.classification) {
                  case "교구장로":
                    order = 10
                    break
                  case "교구장":
                    order = 9
                    break
                  case "부교구장":
                    order = 8
                    break
                  case "구역장":
                    order = 7
                    break
                  case "부구역장":
                    order = 6
                    break
                  case "담당교역자":
                    order = 6
                    break
                  case "부장":
                    order = 5
                    break
                  case "부감":
                    order = 4
                    break
                  case "교사":
                    order = 3
                    break
                  default:
                    break
                }
                seongdo.services = [
                  ...seongdo.services,
                  {
                    group1: service.group1,
                    group2: group2AddForService
                      ? service.group2 + "," + group2AddForService
                      : service.group2,
                    classification: service.classification,
                    order,
                  },
                ]

                await submitHandler()
                isServiceModalHidden = !isServiceModalHidden
                service.group1 = ""
                service.group2 = ""
                service.classification = ""
                group2AddForService = ""
              }
            }}
          >
            <Checkmark scale={16} />
            <span>저장</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- modal for crop image -->
<div
  class="relative z-10 h-full"
  class:hidden={image ? false : true}
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
          class="w-full overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
        >
          <Cropper
            {image}
            bind:crop
            bind:zoom
            aspect={1}
            on:cropcomplete={(e) => {
              pixelCrop = e.detail.pixels
            }}
          />
        </div>
        <div
          class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6 gap-2"
        >
          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={reset}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
          <button
            type="submit"
            class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            on:click={async () => {
              croppedImage = await getCroppedImg(image, pixelCrop)
              // croppedImageForRequest = croppedImage
              const preview = document.getElementById("preview")
              const previewM = document.getElementById("previewM")
              seongdo.avatar = croppedImage
              preview.src = croppedImage
              previewM.src = croppedImage
              reset()
            }}
          >
            <Checkmark scale={16} />
            <span>저장</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
