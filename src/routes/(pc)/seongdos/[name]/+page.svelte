<script lang="ts">
  import { getAgeFromBirth } from "$lib/utils"

  import {
    AddLarge,
    Checkmark,
    Close,
    Search,
    TrashCan,
  } from "carbon-icons-svelte"
  import { onMount } from "svelte"

  $: console.log("(", group1, typeof group1, ")", "(", group2, ")")

  export let data
  const addressData = data.seongdo.address
  const nameData = data.seongdo.name
  const phoneData = data.seongdo.phone
  const ageData = data.seongdo.age
  const remarksData = data.seongdo.remarks
  console.log(remarksData)

  onMount(() => {
    document.getElementById("preview")!.src = seongdo.avatar || "/avatar.png"
    document.getElementById("previewM")!.src = seongdo.avatar || "/avatar.png"

    document.getElementById("jikbun")!.value = seongdo.jikbun
    document.getElementById("jikbunM")!.value = seongdo.jikbun

    document.getElementById("gender")!.value = seongdo.gender
    document.getElementById("genderM")!.value = seongdo.gender

    document.getElementById("singeup")!.value = seongdo.singeup
    document.getElementById("singeupM")!.value = seongdo.singeup

    document.getElementById("address")!.value = extraAddress
      ? address + " (" + extraAddress + ")"
      : address

    document.getElementById("group1")!.value = seongdo.group1
    document.getElementById("group1M")!.value = seongdo.group1
    document.getElementById("group2")!.value = seongdo.group2
    document.getElementById("group2M")!.value = seongdo.group2
  })

  // value for senogdo detail
  $: seongdo = data.seongdo
  $: id = seongdo._id
  $: name = nameData
  $: originalName = name
  $: avatar = seongdo.avatar
  $: birth = seongdo.birth
  $: gender = seongdo.gender
  $: age = ageData
  $: ageWithString = age ? age + " 세" : ""
  $: phone = phoneData
  $: jikbun = seongdo.jikbun
  $: group1 = seongdo.group1
  $: group2 = seongdo.group2
  $: singeup = seongdo.singeup
  $: addressWithExtraAddress = extraAddress
    ? address + " (" + extraAddress + ")"
    : address
  $: address = addressData.split(",")[0] || ""
  $: detailAddress =
    addressData.split(",")[1]?.split("(")[0]?.slice(1, -1) || ""
  $: extraAddress = addressData.split(" (")[1]?.slice(0, -1) || ""
  $: fullAddress = getFullAddress()
  $: getFullAddress = () => {
    if (extraAddress == "" && detailAddress == "") {
      return addressData
    } else if (extraAddress == "") {
      return address + ", " + detailAddress
    } else {
      return address + ", " + detailAddress + " (" + extraAddress + ")"
    }
  }
  $: remarks = remarksData

  // value for family
  $: familyId = data.family?._id
  $: members = data.family?.members || []
  $: memberIds = data.family?.memberIds || []
  $: searchName = ""
  $: seongdoList = []
  $: classification = ""
  $: familyClassList = JSON.parse(data.selectList).familyClassList
  $: selectedIndex = undefined

  // value for simbang
  $: simbangs = data.simbangs
  $: date = ""
  $: hymn = ""
  $: bible = ""
  $: simbangja = ""
  $: detail = ""
  $: teacherList = JSON.parse(data.selectList).teacherList

  $: isFamilyModalHidden = true
  $: isSimbangModalHidden = true

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

    var outputM = document.getElementById("previewM")

    outputM.src = URL.createObjectURL(event.target.files[0])
    outputM.onload = function () {
      URL.revokeObjectURL(outputM.src) // free memory
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

  const submitHandler = async () => {
    const response = await fetch("/api/seongdos", {
      method: "PUT",
      body: JSON.stringify({
        id,
        name: name.trim(),
        originalName,
        avatar,
        birth,
        age: age ? age : getAgeFromBirth(birth),
        gender,
        phone,
        jikbun,
        group1,
        group2: group2 || "미분류",
        singeup,
        address: fullAddress,
        remarks,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      alert("저장되었습니다.")
    }
  }

  const deleteHandler = async () => {
    const response = await fetch("/api/seongdos", {
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
    const response = await fetch(`/api/seongdos?name=${searchName}`, {
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      seongdoList = (await response.json()).seongdos
    }
  }

  const familyHandler = async () => {
    // let response
    if (familyId) {
      const response = await fetch(`/api/families/${familyId}`, {
        method: "PUT",
        body: JSON.stringify({
          memberIds,
          members,
        }),
        headers: {
          "content-type": "application/json",
        },
      })

      return response.ok
    } else {
      const response = await fetch(`/api/families`, {
        method: "POST",
        body: JSON.stringify({
          memberIds,
          members,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
      return response.ok
    }
  }

  const simbangHandler = async () => {
    const response = await fetch(`/api/simbangs`, {
      method: "POST",
      body: JSON.stringify({
        seongdoId: id,
        date,
        hymn,
        bible,
        simbangja,
        detail,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    return response.ok
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

  const getGroupString = (group1: any, group2: any) => {
    if (group1 == "" && group2 == "") {
      return "미분류"
    }
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
  class="sm:px-16 px-6 flex flex-col w-full bg-white overflow-scroll"
>
  <div class="flex flex-col w-full-if-mobile mb-3">
    <div class="신상 flex flex-col">
      <div
        class="sticky top-0 pt-8 bg-white flex justify-between items-start pb-2"
      >
        <h1 class="text-lg font-medium">{seongdo.name} {seongdo.jikbun}</h1>
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
      <div class="flex flex-col text-sm gap-3">
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
                loadFile(e)
              }}
            />
          </div>
          <div class="flex flex-col gap-3 w-full">
            <div class="flex flex-col w-full md:flex-row gap-3">
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
              <div class="flex w-full h-8 bg-gray-50 border-gray-300 border">
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
                    max="2023-12-31"
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
            </div>
            <div class="flex flex-col w-full md:flex-row gap-3">
              <div class="flex w-full h-8 border-gray-300 border">
                <label
                  for="gender"
                  class="flex flex-none w-[4.8rem] md:w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >성별</label
                >
                <div class="flex w-full bg-gray-50 px-1">
                  <select
                    id="gender"
                    on:change={() => {
                      gender = document.querySelector(
                        "#gender > option:checked"
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
                      on:change={() => {
                        jikbun = document.querySelector(
                          "#jikbun > option:checked"
                        ).value
                      }}
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      <option value="장로">장로</option>
                      <option value="안수집사">안수집사</option>
                      <option value="권사">권사</option>
                      <option value="집사">집사</option>
                      <option value="권찰">권찰</option>
                      <option value="성도">성도</option>
                    </select>
                    <div class="border-l border-gray-300" />
                    <select
                      id="singeup"
                      on:change={() => {
                        singeup = document.querySelector(
                          "#singeup > option:checked"
                        ).value
                      }}
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                    bind:value={phone}
                    class="flex w-full px-2 bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                      id="group1"
                      on:change={() => {
                        group1 = document.querySelector(
                          "#group1 > option:checked"
                        ).value
                        group2 = ""
                      }}
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    >
                      <option value="none" class="hidden" />
                      <option value="장년부">장년부</option>
                      <option value="청년부">청년부</option>
                      <option value="교회학교">교회학교</option>
                    </select>
                    <div class="border-l border-gray-300" />
                    <input
                      id="temp"
                      type="text"
                      class="flex w-[45.5%] text-center bg-gray-50 text-gray-900 text-[12.5px] focus:outline-0"
                      class:hidden={group1 == "장년부" && group2 != ""
                        ? false
                        : true}
                      value={getGroupString(group1, group2)}
                      on:focus={() => {
                        group2 = ""
                        document.querySelector("#group2").value = ""
                      }}
                    />
                    <select
                      id="group2"
                      required
                      on:change={() => {
                        group2 = document.querySelector("#group2").value
                      }}
                      class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                      class:hidden={group1 == "장년부" && group2 != ""
                        ? true
                        : false}
                    >
                      <option value="none" class="hidden" />
                      {#if group1 == "장년부"}
                        <optgroup label="1구역">
                          <option value="1구역,1교구">1교구</option>
                          <option value="1구역,2교구">2교구</option>
                          <option value="1구역,3교구">3교구</option>
                          <option value="1구역,4교구">4교구</option>
                        </optgroup>
                        <optgroup label="2구역">
                          <option value="2구역,1교구">1교구</option>
                          <option value="2구역,2교구">2교구</option>
                          <option value="2구역,3교구">3교구</option>
                          <option value="2구역,4교구">4교구</option>
                        </optgroup>
                      {:else if group1 == "청년부"}
                        <option value="1청년">1청년</option>
                        <option value="2청년">2청년</option>
                      {:else if group1 == "교회학교"}
                        <option value="영아부">영아부</option>
                        <option value="유치부">유치부</option>
                        <option value="유년부">유년부</option>
                        <option value="초등부">초등부</option>
                        <option value="중등부">중등부</option>
                        <option value="고등부">고등부</option>
                      {/if}
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
                  loadFile(e)
                }}
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
                    on:change={() => {
                      gender = document.querySelector(
                        "#gender > option:checked"
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
                  class="flex flex-auto bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 px-1 border-gray-300"
                  min="1900-01-01"
                  max="2023-12-31"
                  value={birth}
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
                  bind:value={phone}
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
                      jikbun = document.querySelector(
                        "#jikbunM > option:checked"
                      ).value
                    }}
                    class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <option value="장로">장로</option>
                    <option value="안수집사">안수집사</option>
                    <option value="권사">권사</option>
                    <option value="집사">집사</option>
                    <option value="권찰">권찰</option>
                    <option value="성도">성도</option>
                  </select>
                  <div class="border-l border-gray-300" />
                  <select
                    id="singeupM"
                    on:change={() => {
                      singeup = document.querySelector(
                        "#singeupM > option:checked"
                      ).value
                    }}
                    class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                  >소속</label
                >
                <div class="flex w-full justify-center gap-1 pr-1">
                  <select
                    id="group1M"
                    on:change={() => {
                      group1 = document.querySelector(
                        "#group1M > option:checked"
                      ).value
                      group2 = ""
                    }}
                    class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  >
                    <option value="none" class="hidden" />
                    <option value="장년부">장년부</option>
                    <option value="청년부">청년부</option>
                    <option value="교회학교">교회학교</option>
                  </select>
                  <div class="border-l border-gray-300" />
                  <input
                    id="tempM"
                    type="text"
                    class="flex w-[45.5%] text-center bg-gray-50 text-gray-900 text-[12.5px] focus:outline-0"
                    class:hidden={group1 == "장년부" && group2 != ""
                      ? false
                      : true}
                    value={getGroupString(group1, group2)}
                    on:focus={() => {
                      group2 = ""
                      document.querySelector("#group2M").value = ""
                    }}
                  />
                  <select
                    id="group2M"
                    required
                    on:change={() => {
                      group2 = document.querySelector("#group2M").value
                    }}
                    class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    class:hidden={group1 == "장년부" && group2 != ""
                      ? true
                      : false}
                  >
                    <option value="none" class="hidden" />
                    {#if group1 == "장년부"}
                      <optgroup label="1구역">
                        <option value="1구역,1교구">1교구</option>
                        <option value="1구역,2교구">2교구</option>
                        <option value="1구역,3교구">3교구</option>
                        <option value="1구역,4교구">4교구</option>
                      </optgroup>
                      <optgroup label="2구역">
                        <option value="2구역,1교구">1교구</option>
                        <option value="2구역,2교구">2교구</option>
                        <option value="2구역,3교구">3교구</option>
                        <option value="2구역,4교구">4교구</option>
                      </optgroup>
                    {:else if group1 == "청년부"}
                      <option value="1청년">1청년</option>
                      <option value="2청년">2청년</option>
                    {:else if group1 == "교회학교"}
                      <option value="영아부">영아부</option>
                      <option value="유치부">유치부</option>
                      <option value="유년부">유년부</option>
                      <option value="초등부">초등부</option>
                      <option value="중등부">중등부</option>
                      <option value="고등부">고등부</option>
                    {/if}
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
            bind:value={addressWithExtraAddress}
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
            bind:value={detailAddress}
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
            autocomplete="off"
            bind:value={remarks}
            class="resize-none flex justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
          />
        </div>
      </div>
    </div>
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
            }}
          >
            <AddLarge scale={16} />
            <span>가족 추가</span>
          </button>
        </div>
      </div>
      <div class="flex text-sm border-l overflow-scroll">
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <div
            class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
          >
            사진
          </div>

          {#if members.length > 0}
            {#each members as member}
              <div class="flex justify-center px-2 items-center h-10">
                <img
                  class="mx-auto object-cover w-8 h-8"
                  src={member.seongdo.avatar || "/avatar.png"}
                  alt=""
                />
              </div>
            {/each}
          {/if}
        </div>

        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <div
            class="flex justify-center px-2 bg-[#D9D9D8] font-bold items-center h-10"
          >
            구분
          </div>
          {#if members.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-2 items-center h-10">
                {member.classification}
              </div>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <button
            class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          >
            이름
          </button>
          {#if members.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex px-3 items-center h-10">
                {member.seongdo.name}
              </div>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <button
            class="flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          >
            직분
          </button>
          {#if members.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex px-3 justify-center items-center h-10">
                {member.seongdo.jikbun}
              </div>
            {/each}
          {/if}
        </div>
        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 생년월일 </button>
          {#if members.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-3 items-center h-10">
                {member.seongdo.birth}
              </div>
            {/each}
          {/if}
        </div>
        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 나이 </button>
          {#if members.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-3 items-center h-10">
                {member.seongdo.age}
              </div>
            {/each}
          {/if}
        </div>

        <div
          class="flex flex-col flex-auto sm:flex-none whitespace-nowrap border-r divide-y border-b"
        >
          <button class=" px-3 font-bold h-10 bg-[#D9D9D8]"> 핸드폰 </button>
          {#if members.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-3 items-center h-10">
                {member.seongdo.phone}
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
          {#if members.length > 0}
            <!-- content here -->
            {#each members as member}
              <div class="flex justify-center px-3 items-center h-10">
                {member.seongdo.group1
                  ? getGroupString(member.seongdo.group1, member.seongdo.group2)
                  : "미분류"}
              </div>
            {/each}
          {/if}
        </div>
        <div class="flex flex-col whitespace-nowrap border-r divide-y border-b">
          <button
            class=" flex justify-between gap-2 px-3 bg-[#D9D9D8] font-bold items-center h-10"
          />
          {#if members.length > 0}
            {#each members as member}
              <div class="flex items-center px-3 h-10">
                <button
                  type="button"
                  class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
                  on:click={async () => {
                    memberIds = memberIds.filter(
                      (id) => id != member.seongdo._id
                    )
                    members = members.filter(
                      (seongdo) => seongdo._id != member._id
                    )
                    await familyHandler()
                    seongdoList = []
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
    <div class="심방내역 flex flex-col mb-8">
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
              <div class="flex justify-center px-3 items-center h-10">
                {simbang.date}
              </div>
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
                  {simbang.detail}
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
              class="flex flex-col whitespace-nowrap border-r divide-y border-b"
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
              class="flex flex-col whitespace-nowrap border-r divide-y border-b hidden-if-modile"
            >
              <button
                class="flex justify-between bg-[#D9D9D8] px-3 font-bold items-center h-10"
              >
                생년월일
              </button>

              {#each seongdoList as item, index}
                <div class="flex px-3 items-center h-10">
                  <button>
                    {item.birth}
                  </button>
                </div>
              {/each}
            </div>

            <div
              class="flex flex-col flex-auto whitespace-nowrap divide-y border-b"
            >
              <button
                class="flex justify-between gap-2 pl-3 bg-[#D9D9D8] font-bold items-center h-10"
              >
                구분
              </button>
              {#each seongdoList as item, index}
                <div class="flex pl-3 py-1 items-center h-10">
                  <select
                    on:change={(e) => {
                      classification = e.target.value
                      console.log(classification)

                      if (classification == "직접입력") {
                        classification = ""
                        selectedIndex = seongdoList.indexOf(item)
                      }
                    }}
                    class="w-full border h-full text-gray-900 text-sm focus:outline-0"
                    class:hidden={selectedIndex == index ? true : false}
                  >
                    <option value="none" class="hidden" />
                    <option value="직접입력">직접입력</option>
                    {#each familyClassList as familyClass}
                      <option value={familyClass}>{familyClass}</option>
                    {/each}
                  </select>
                  <input
                    id="직접입력"
                    placeholder="직접입력"
                    type="text"
                    bind:value={classification}
                    class="w-full border h-full text-gray-900 text-sm focus:outline-0 px-2"
                    class:hidden={selectedIndex == index ? false : true}
                  />
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
                <div class="flex items-center px-1 h-10">
                  <button
                    type="button"
                    class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
                    on:click={async () => {
                      if (memberIds.includes(item._id)) {
                        alert("이미 가족 구성원으로 추가되었습니다.")
                      } else {
                        memberIds = [...memberIds, item._id]
                        members = [
                          ...members,
                          { seongdo: item, classification },
                        ]
                        await familyHandler()
                        searchName = ""
                        classification = ""
                        isFamilyModalHidden = true
                        seongdoList = []
                        selectedIndex = undefined
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
              isFamilyModalHidden = !isFamilyModalHidden
              seongdoList = []
              searchName = ""
              selectedIndex = undefined
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>
        </div>
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
          class="w-full overflow-scroll h-full min-h-[calc(100%-55px)] bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4"
        >
          <h1 class="text-left text-lg font-medium mb-2">심방 생성</h1>
          <form class="flex flex-col" on:submit={submitHandler}>
            <div class="flex flex-col text-sm gap-3">
              <div class="flex w-full h-8 border-gray-300 border-x border-y">
                <label
                  for="simbangDate"
                  class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >심방 날짜</label
                >
                <div class="flex flex-auto justify-start bg-gray-50 px-1">
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
                  for="simbangHymn"
                  class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >찬송</label
                >
                <div class="flex flex-auto justify-start bg-gray-50">
                  <input
                    id="simbangHymn"
                    type="text"
                    bind:value={hymn}
                    class="px-2 flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                    class="px-2 flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                  />
                </div>
              </div>

              <div class="flex w-full h-8 border-gray-300 border-x border-y">
                <label
                  for="simbangSimbangja"
                  class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >심방자</label
                >
                <div class="flex flex-auto justify-start bg-gray-50">
                  <select
                    id="simbangSimbangja"
                    class="px-2 flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
                    on:change={() => {
                      simbangja = document.querySelector(
                        "#simbangSimbangja > option:checked"
                      ).value
                    }}
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
                  for="simbangDetail"
                  class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                  >내용</label
                >
                <div class="flex flex-auto justify-start bg-gray-50">
                  <input
                    id="simbangDetail"
                    type="text"
                    bind:value={detail}
                    class="px-2 flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              isSimbangModalHidden = !isSimbangModalHidden
              date = ""
              hymn = ""
              bible = ""
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
              const result = await simbangHandler()
              if (result) {
                simbangs = [
                  { date, hymn, bible, simbangja, detail },
                  ...simbangs,
                ]
              }
              isSimbangModalHidden = !isSimbangModalHidden
              date = ""
              hymn = ""
              bible = ""
              simbangja = ""
              detail = ""
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
