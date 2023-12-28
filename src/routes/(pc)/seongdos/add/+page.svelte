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
  let age: number
  $: ageWithString = age ? age + " 세" : ""
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
        group2: group2Add ? group2 + "," + group2Add : group2,
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
      toast.success("저장되었습니다.")
      goto(`/seongdos/${newName}?create=true`)
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
                  placeholder="010-0000-0000"
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
                    {#each Object.keys(groupList) as group1}
                      <option value={group1}>{group1}</option>
                    {/each}
                    <!-- <option value="장년부">장년부</option>
                    <option value="청년부">청년부</option>
                    <option value="교회학교">교회학교</option> -->
                  </select>
                  <div class="border-l border-gray-300" />

                  <select
                    id="group2"
                    required
                    on:change={() => {
                      group2 = document.querySelector("#group2").value
                    }}
                    class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                    on:change={() => {
                      group2Add = document.querySelector("#group2Add").value
                    }}
                    class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                placeholder="010-0000-0000"
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
                  {#each Object.keys(groupList) as group1}
                    <option value={group1}>{group1}</option>
                  {/each}
                </select>
                <div class="border-l border-gray-300" />

                <select
                  id="group2M"
                  required
                  on:change={() => {
                    group2 = document.querySelector("#group2M").value
                  }}
                  class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
                  on:change={() => {
                    group2Add = document.querySelector("#group2MAdd").value
                  }}
                  class="flex flex-auto bg-gray-50 text-gray-900 text-sm focus:outline-0"
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
