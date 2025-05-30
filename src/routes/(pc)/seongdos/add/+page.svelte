<script lang="ts">
  import { goto } from "$app/navigation"
  import { getAgeFromBirth, getGroupItem } from "$lib/utils"
  import toast from "svelte-french-toast"
  import { Checkmark, Close } from "carbon-icons-svelte"

  export let data
  $: groupList = data.groupList

  let name = ""
  let avatar = ""
  $: birth = ""
  $: enrolled_at = ""
  let age: number
  $: ageWithString = age > -1 ? age + " 세" : ""
  let gender = ""
  let phone = ""
  let jikbun = ""
  $: group1 = ""
  $: group2 = ""
  $: groupItem = getGroupItem(group1, group2)
  $: group2Add = groupItem.group2Add
  let singeup = ""
  $: addressWithExtraAddress = extraAddress
    ? address + " (" + extraAddress + ")"
    : address
  $: address = ""
  $: detailAddress = ""
  $: extraAddress = ""

  $: fullAddress = getFullAddress()
  $: getFullAddress = () => {
    if (extraAddress == "" && detailAddress == "") {
      return address
    } else if (extraAddress == "") {
      return address + ", " + detailAddress
    } else {
      return address + ", " + detailAddress + " (" + extraAddress + ")"
    }
  }

  const seongdoAdd = async () => {
    const response = await fetch("/api/seongdos", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        originalName: name.trim(),
        avatar,
        birth,
        age,
        gender,
        phone,
        jikbun,
        group1,
        group2: group2Add ? group2 + "," + group2Add : group2,
        singeup,
        address: fullAddress,
        enrolled_at,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      const {
        seongdo: { name: newName },
      } = await response.json()
      goto(`/seongdos/${newName}?create=true`)
    }
  }

  const submitHandler = async () => {
    if (name == "") {
      toast.error("이름을 입력해주세요.")
      return
    }
    let response = await fetch(
      `/api/v2/seongdos/getSeongdoByName?name=${name.trim()}&excludeStu=true`,
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
      toast.promise(seongdoAdd(), {
        loading: "저장 중입니다...",
        success: `저장되었습니다!`,
        error: "오류가 발생했습니다.",
      })
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

  import Cropper from "svelte-easy-crop"
  import { getCroppedImg, getThumbFile } from "$lib/utils/canvasUtils.js"

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
</script>

<div
  id="content"
  class="sm:px-16 px-6 flex flex-col w-full bg-white overflow-x-scroll"
>
  <div class="flex flex-col w-full-if-mobile mb-3">
    <div class="신상 flex flex-col">
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2"
      >
        <h1 class="text-lg font-medium">새 성도 추가</h1>
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
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              history.back()
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
        </div>
      </div>
      <form class="flex flex-col text-sm gap-3">
        <div class="hidden md:flex gap-3">
          <div class="flex flex-none">
            <label for="photo-dropbox">
              <img
                alt=""
                id="preview"
                src={"/avatar.png"}
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
                    bind:value={name}
                    required
                    class="flex w-full bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
                  />
                  <div class="border-l border-gray-300" />
                  <select
                    id="gender"
                    value={gender}
                    on:change={() => {
                      gender = document.querySelector(
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
                      enrolled_at = e.target.value
                    }}
                    class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 pl-1 pr-2 border-gray-300"
                    min="1900-01-01"
                    max="2025-12-31"
                    value={enrolled_at}
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
                      birth = e.target.value
                      age = getAgeFromBirth(birth)
                    }}
                    class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 pl-1 pr-2 border-gray-300 border-r"
                    min="1900-01-01"
                    max="2025-12-31"
                    value={birth}
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
                  <div class="relative flex w-full justify-center gap-1 pr-1">
                    <select
                      id="jikbun"
                      value={jikbun}
                      on:change={() => {
                        jikbun = document.querySelector("#jikbun").value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      <optgroup label="교역자">
                        <option value="목사">목사</option>
                        <option value="강도사">강도사</option>
                        <option value="전임전도사">전임전도사</option>
                        <option value="교육전도사">교육전도사</option>
                      </optgroup>
                      <optgroup label="장로">
                        <option value="시무장로">시무장로</option>
                        <option value="무임장로">무임장로</option>
                        <option value="협동장로">협동장로</option>
                        <option value="은퇴장로">은퇴장로</option>
                        <option value="무임은퇴장로">무임은퇴장로</option>
                      </optgroup>
                      <hr />

                      <optgroup label="권사">
                        <option value="시무권사">시무권사</option>
                        <option value="무임권사">무임권사</option>
                        <option value="은퇴권사">은퇴권사</option>
                        <option value="무임은퇴권사">무임은퇴권사</option>
                      </optgroup>
                      <hr />
                      <optgroup label="장립집사">
                        <option value="장립집사">장립집사</option>
                        <option value="무임장립집사">무임장립집사</option>
                        <option value="은퇴장립집사">은퇴장립집사</option>
                        <option value="무임은퇴장립집사"
                          >무임은퇴장립집사</option
                        >
                      </optgroup>
                      <hr />
                      <optgroup label="서리집사">
                        <option value="서리집사">서리집사</option>
                        <option value="명예서리집사">명예서리집사</option>
                      </optgroup>

                      <hr />
                      <optgroup label="성도">
                        <option value="성도">성도</option>
                      </optgroup>
                    </select>

                    <div class="border-l border-gray-300" />
                    <select
                      id="singeup"
                      value={singeup}
                      on:change={() => {
                        singeup = document.querySelector(
                          "#singeup > option:checked"
                        ).value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      <option value="성도">성도</option>
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
                    value={phone}
                    class="flex w-full px-2 bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    on:input={(e) => {
                      phone = e.target.value
                    }}
                  />
                </div>
              </div>
              <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
                <div class="flex w-full gap-1">
                  <label
                    for="name"
                    class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                    >소속</label
                  >
                  <div class="flex w-full justify-center gap-1 pr-1">
                    <select
                      value={groupItem.group1}
                      id="group1"
                      on:change={() => {
                        group1 = document.querySelector(
                          "#group1 > option:checked"
                        ).value
                        group2 = ""
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
                        group2 = document.querySelector("#group2").value
                      }}
                      class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      {#if group1 == "장년부"}
                        {#each groupList["장년부"] as item}
                          <option value={item}>{item}</option>
                        {/each}
                      {:else if group1 == "청년부"}
                        {#each groupList["청년부"] as item}
                          <option value={item}>{item}</option>
                        {/each}
                      {:else if group1 == "교회학교"}
                        {#each groupList["교회학교"] as item}
                          <option value={item}>{item}</option>
                        {/each}
                      {:else if group1 == "교역자"}
                        <option value="목사">목사</option>
                        <option value="강도사">강도사</option>
                        <option value="전임전도사">전임전도사</option>
                        <option value="교육전도사">교육전도사</option>
                      {:else if group1 == "기타"}
                        <option value="제적">제적</option>
                      {/if}
                    </select>
                    <div
                      class="border-l border-gray-300"
                      class:hidden={group1 == "장년부" && group2 != ""
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
                      class:hidden={group1 == "장년부" && group2 != ""
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
                      <option value="25구역">25구역</option>
                      <option value="26구역">26구역</option>
                      <option value="27구역">27구역</option>
                      <option value="28구역">28구역</option>
                      <option value="29구역">29구역</option>
                      <option value="30구역">30구역</option>
                      <option value="청년">청년</option>
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
                  src={"/avatar.png"}
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
                  bind:value={name}
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
                    value={gender}
                    on:change={() => {
                      gender = document.querySelector(
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
                    birth = e.target.value
                    age = getAgeFromBirth(birth)
                  }}
                  class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 border-gray-300 px-1"
                  min="1900-01-01"
                  max="2025-12-31"
                  value={birth}
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
                    enrolled_at = e.target.value
                  }}
                  class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 border-gray-300 px-1"
                  min="1900-01-01"
                  max="2025-12-31"
                  value={enrolled_at}
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
                  value={phone}
                  on:input={(e) => {
                    phone = e.target.value
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
                      jikbun = document.querySelector("#jikbunM").value
                    }}
                    value={jikbun}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <optgroup label="교역자">
                      <option value="목사">목사</option>
                      <option value="강도사">강도사</option>
                      <option value="전임전도사">전임전도사</option>
                      <option value="교육전도사">교육전도사</option>
                    </optgroup>
                    <optgroup label="장로">
                      <option value="시무장로">시무장로</option>
                      <option value="무임장로">무임장로</option>
                      <option value="협동장로">협동장로</option>
                      <option value="은퇴장로">은퇴장로</option>
                      <option value="무임은퇴장로">무임은퇴장로</option>
                    </optgroup>
                    <hr />

                    <optgroup label="권사">
                      <option value="시무권사">시무권사</option>
                      <option value="무임권사">무임권사</option>
                      <option value="은퇴권사">은퇴권사</option>
                      <option value="무임은퇴권사">무임은퇴권사</option>
                    </optgroup>
                    <hr />
                    <optgroup label="장립집사">
                      <option value="장립집사">장립집사</option>
                      <option value="무임장립집사">무임장립집사</option>
                      <option value="은퇴장립집사">은퇴장립집사</option>
                      <option value="무임은퇴장립집사">무임은퇴장립집사</option>
                    </optgroup>
                    <hr />
                    <optgroup label="서리집사">
                      <option value="서리집사">서리집사</option>
                      <option value="명예서리집사">명예서리집사</option>
                    </optgroup>
                    <hr />
                    <optgroup label="권찰">
                      <option value="권찰">권찰</option>
                    </optgroup>
                    <hr />
                    <optgroup label="성도">
                      <option value="성도">성도</option>
                    </optgroup>
                  </select>
                  <div class="border-l border-gray-300" />
                  <select
                    id="singeupM"
                    value={singeup}
                    on:change={() => {
                      singeup = document.querySelector(
                        "#singeupM > option:checked"
                      ).value
                    }}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <option value="성도">성도</option>
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
                  >소속</label
                >
                <div class="flex w-full justify-center gap-1 pr-1">
                  <select
                    id="group1M"
                    value={groupItem.group1}
                    on:change={() => {
                      group1 = document.querySelector(
                        "#group1M > option:checked"
                      ).value
                      group2 = ""
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
                      group2 = document.querySelector("#group2M").value
                    }}
                    class="flex w-full bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    {#if group1 == "장년부"}
                      {#each groupList["장년부"] as item}
                        <option value={item}>{item}</option>
                      {/each}
                    {:else if group1 == "청년부"}
                      {#each groupList["청년부"] as item}
                        <option value={item}>{item}</option>
                      {/each}
                    {:else if group1 == "교회학교"}
                      {#each groupList["교회학교"] as item}
                        <option value={item}>{item}</option>
                      {/each}
                    {:else if group1 == "교역자"}
                      <option value="목사">목사</option>
                      <option value="강도사">강도사</option>
                      <option value="전임전도사">전임전도사</option>
                      <option value="교육전도사">교육전도사</option>
                    {:else if group1 == "기타"}
                      <option value="제적">제적</option>
                    {/if}
                  </select>
                  <div
                    class="border-l border-gray-300"
                    class:hidden={group1 == "장년부" && group2 != ""
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
                    class:hidden={group1 == "장년부" && group2 != ""
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
                    <option value="25구역">25구역</option>
                    <option value="26구역">26구역</option>
                    <option value="27구역">27구역</option>
                    <option value="28구역">28구역</option>
                    <option value="29구역">29구역</option>
                    <option value="30구역">30구역</option>
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
      </form>
    </div>
  </div>
</div>

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
              croppedImageForRequest = croppedImage
              const preview = document.getElementById("preview")
              const previewM = document.getElementById("previewM")
              avatar = croppedImage
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
