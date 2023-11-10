<script lang="ts">
  import { goto } from "$app/navigation"
  import { getAgeFromBirth } from "$lib/utils"

  import { Checkmark, Close } from "carbon-icons-svelte"
  $: console.log("(", group1, ")", "(", group2, ")")

  let name = ""
  let avatar = ""
  $: birth = ""
  let age: number
  $: ageWithString = age ? age + " 세" : ""
  let gender = ""
  let phone = ""
  let jikbun = ""
  $: group1 = ""
  $: group2 = ""
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

  const submitHandler = async () => {
    const response = await fetch("/api/seongdos", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        avatar,
        birth,
        age,
        gender,
        phone,
        jikbun,
        group1,
        group2,
        singeup,
        address: fullAddress,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    if (response.ok) {
      const {
        seongdo: { name: newName },
      } = await response.json()
      alert("저장되었습니다.")
      goto(`/seongdos/${newName}`)
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

  const getGroupString = (group1: any, group2: any) => {
    if (group1 == "장년부") {
      return group2.split(",")[0] + " > " + group2.split(",")[1]
    } else {
      return group2
    }
  }
</script>

<div
  id="content"
  class="sm:px-16 px-6 py-8 flex flex-col w-full bg-white overflow-x-scroll"
>
  <form class="flex flex-col w-full-if-mobile">
    <div class="flex justify-between items-start mb-2">
      <h1 class="text-lg font-medium">새 성도 추가</h1>
      <div class="flex mb-2 ml-auto gap-2">
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
                    console.log(getGroupString(group1, group2))
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
      <div
        class="relative flex h-8 flex-auto border-gray-300 border-x border-y"
      >
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
    </div>
  </form>
</div>

<!-- <div id="content" class="px-12 py-8 flex w-full bg-white overflow-x-scroll">
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
          on:click={async () => {
            history.back()
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
      <div class="flex gap-3 w-full">
        <div class="flex">
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
        <div class="flex flex-col gap-3">
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
                class="flex w-[9.5rem] bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
              />
            </div>
            <div
              class="flex h-8 border-gray-300 bg-gray-50 border-x border-y w-[18.25rem]"
            >
              <label
                for="date"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
                >생일 / 나이</label
              >

              <input
                id="date"
                type="date"
                on:change={(e) => {
                  birth = e.target.value
                  age = getAgeFromBirth(birth)
                }}
                class="flex w-[9rem] bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2 border-gray-300 border-r"
                min="1900-01-01"
                max="2023-12-31"
                value={birth}
              />
              <input
                id="age"
                type="text"
                value={ageWithString}
                disabled
                class="flex w-[3.5rem] text-center bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
              />
            </div>
          </div>
          <div class="flex gap-3">
            <div class="flex h-8 border-gray-300 border-x border-y">
              <label
                for="gender"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0] whitespace-nowrap text-ellipsis"
                >성별</label
              >
              <div class="flex w-[9.5rem] justify-start bg-gray-50 px-1">
                <select
                  id="gender"
                  on:change={() => {
                    gender = document.querySelector(
                      "#gender > option:checked"
                    ).value
                  }}
                  class="flex w-[8.8rem] bg-gray-50 text-gray-900 text-sm focus:outline-0"
                >
                  <option value="none" class="hidden" />
                  <option value="남자">남자</option>
                  <option value="여자">여자</option>
                </select>
              </div>
            </div>
            <div class="flex h-8 border-gray-300 bg-gray-50 border-x border-y">
              <label
                for="jikbun"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
                >직분 / 신급</label
              >
              <div class="flex w-[12.25rem] justify-center gap-3 pr-1">
                <select
                  id="jikbun"
                  on:change={() => {
                    jikbun = document.querySelector(
                      "#jikbun > option:checked"
                    ).value
                  }}
                  class="flex w-[4.8rem] bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                  class="flex w-[4.8rem] bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                class="flex w-[9.5rem] bg-gray-50 border-0 text-gray-900 text-sm focus:outline-0 p-2"
                placeholder="ex) 010-0000-0000"
              />
            </div>
            <div class="flex h-8 border-gray-300 bg-gray-50 border-x border-y">
              <label
                for="group1"
                class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
                >소속</label
              >
              <div class="flex w-[12.25rem] justify-center gap-3 pr-1">
                <select
                  id="group1"
                  on:change={() => {
                    group1 = document.querySelector(
                      "#group1 > option:checked"
                    ).value
                    group2 = ""
                  }}
                  class="flex w-[4.8rem] bg-gray-50 text-gray-900 text-sm focus:outline-0"
                >
                  <option value="none" class="hidden" />
                  <option value="장년부">장년부</option>
                  <option value="청년부">청년부</option>
                  <option value="교회학교">교회학교</option>
                </select>
                <div class="border-l border-gray-300" />
                <input
                  required
                  type="text"
                  class="flex w-[4.8rem] bg-gray-50 text-gray-900 text-[12.5px] focus:outline-0"
                  class:hidden={group1 == "장년부" && group2 != ""
                    ? false
                    : true}
                  value={`${group2.split(",")[0]} > ${group2.split(",")[1]}`}
                  on:focus={() => {
                    group2 = ""
                    // document.querySelector("#group2").value = ""
                  }}
                />
                <select
                  id="group2"
                  required
                  on:change={() => {
                    group2 = document.querySelector("#group2").value

                    console.dir(document.querySelector("#group2"))
                  }}
                  class="flex w-[4.8rem] bg-gray-50 text-gray-900 text-sm focus:outline-0"
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

      <div class="flex w-[43rem] h-8 border-gray-300 border-x border-y">
        <label
          for="address"
          class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >주소</label
        >

        <input
          id="address"
          autocomplete="off"
          bind:value={addressWithExtraAddress}
          class="flex w-full justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
          on:click={searchAddress}
        />
      </div>
      <div
        class="relative flex h-8 w-[43rem] border-gray-300 border-x border-y"
      >
        <label
          for="detailAddress"
          class="flex flex-none w-[6rem] items-center text-white pl-2 bg-[#B0B1B0]"
          >상세주소</label
        >

        <input
          id="detailAddress"
          autocomplete="off"
          bind:value={detailAddress}
          type="text"
          class="flex justify-between bg-gray-50 border-0 text-gray-900 w-full text-sm focus:outline-0 p-2"
        />
      </div>
      <div
        class="relative flex h-8 w-[43rem] border-gray-300 border-x border-y"
      >
        <label
          for="기초반"
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
</div> -->
