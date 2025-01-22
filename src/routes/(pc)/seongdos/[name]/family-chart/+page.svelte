<script lang="ts">
  import AddDaughter from "./components/AddDaughter.svelte"
  import AddSon from "./components/AddSon.svelte"
  import AddMother from "./components/AddMother.svelte"
  import AddFather from "./components/AddFather.svelte"
  import AddSpouse from "./components/AddSpouse.svelte"
  import Card from "./components/Card.svelte"
  import { onMount } from "svelte"
  import "./family-chart.css"
  import {
    Close,
    Edit,
    ArrowUp,
    ArrowDown,
    AddLarge,
  } from "carbon-icons-svelte"
  import toast from "svelte-french-toast"
  import { getFamilyChartFromDb } from "$lib/utils"
  import { goto, invalidateAll } from "$app/navigation"
  import type { IPage, ISeongdo } from "$lib/interfaces"

  export let data: {
    seongdo: any
    charts: any
    allowedGroup: string[]
  }

  let page: IPage
  let Iseongdo: ISeongdo

  $: allowedGroup = data.allowedGroup
  $: seongdo = data.seongdo
  $: searchSeongdos = []
  $: seongdoPage = page
  $: charts = data.charts.charts
  $: chartId = data.charts._id
  $: newPerson = null
  $: addType = ""
  $: newChart = {}

  $: searchName = ""
  $: isAdding = false
  $: isModalHidden = true
  $: f3Chart = null
  $: f3Card = null

  $: take = seongdoPage?.requestParams.take
  $: name = seongdoPage?.requestParams.name
  $: now = seongdoPage?.requestPage
  $: min =
    now % 5 == 0 ? (parseInt(now / 5) - 1) * 5 + 1 : parseInt(now / 5) * 5 + 1
  $: last = seongdoPage?.totalPage
  $: pagination = [0, 1, 2, 3, 4]
    .filter((i) => min + i <= last)
    .map((i) => min + i)

  let idWithBirth: any

  $: getIdWithBirth = () => {
    idWithBirth = sortDate(
      charts.map((chart) => {
        return {
          id: chart.id,
          birth: chart.data["생년월일"],
        }
      })
    )
  }

  const searchHandler = async (pageInput: number) => {
    const response = await fetch(
      `/api/seongdos?name=${name}&seongdoPage=${pageInput}&take=${take}`,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    if (response.ok) {
      const result = await response.json()

      searchSeongdos = result.seongdos
      seongdoPage = result.seongdoPage
    }
  }

  function sortDate(charts) {
    const sorted_charts = charts.sort(function (a, b) {
      return new Date(a.birth).getTime() - new Date(b.birth).getTime()
    })

    return sorted_charts
  }

  const addSpouse = async (chart) => {
    charts = [
      ...charts,
      {
        id: newPerson._id,
        rels: { spouses: [chart.id], children: chart.rels.children },
        data: {
          이름: newPerson.name,
          생년월일: newPerson.birth,
          avatar: newPerson.avatar,
          gender:
            newPerson.gender == "남자"
              ? "M"
              : newPerson.gender == "여자"
                ? "F"
                : "",
        },
      },
    ]
    chart.rels.spouses = [newPerson._id]
    chart.rels.children.map((child) => {
      if (
        charts.filter((item) => item.id == child)[0].rels.father == chart.id
      ) {
        charts.filter((item) => item.id == child)[0].rels.mother = newPerson._id
      } else if (
        charts.filter((item) => item.id == child)[0].rels.mother == chart.id
      ) {
        charts.filter((item) => item.id == child)[0].rels.father = newPerson._id
      }
    })
  }
  const addFather = async (chart) => {
    charts = [
      ...charts,
      {
        id: newPerson._id,
        rels: { children: [chart.id], spouses: [chart.rels.mother] },
        data: {
          이름: newPerson.name,
          생년월일: newPerson.birth,
          avatar: newPerson.avatar,
          gender:
            newPerson.gender == "남자"
              ? "M"
              : newPerson.gender == "여자"
                ? "F"
                : "",
        },
      },
    ]
    chart.rels.father = [newPerson._id]
  }
  const addMother = async (chart) => {
    charts = [
      ...charts,
      {
        id: newPerson._id,
        rels: { children: [chart.id], spouses: [chart.rels.father] },
        data: {
          이름: newPerson.name,
          생년월일: newPerson.birth,
          avatar: newPerson.avatar,
          gender:
            newPerson.gender == "남자"
              ? "M"
              : newPerson.gender == "여자"
                ? "F"
                : "",
        },
      },
    ]
    chart.rels.mother = [newPerson._id]
  }
  const addChild = async (chart) => {
    charts = [
      ...charts,
      {
        id: newPerson._id,
        rels:
          chart.data.gender == "M" && chart.rels.spouses.length > 0
            ? { father: chart.id, mother: chart.rels.spouses[0] }
            : { mother: chart.id, father: chart.rels.spouses[0] },
        data: {
          이름: newPerson.name,
          생년월일: newPerson.birth,
          avatar: newPerson.avatar,
          gender:
            newPerson.gender == "남자"
              ? "M"
              : newPerson.gender == "여자"
                ? "F"
                : "",
        },
      },
    ]
    chart.rels.children = [...chart.rels.children, newPerson._id]

    getIdWithBirth()
    idWithBirth = idWithBirth.map((i) => i.id)

    idWithBirth = idWithBirth.filter(
      (el) => chart.rels.children.indexOf(el) >= 0
    )

    chart.rels.children = idWithBirth

    if (chart.rels.spouses.length > 0) {
      charts.filter(
        (item) => item.id == chart.rels.spouses[0]
      )[0].rels.children = chart.rels.children
    }
  }

  const postAddPerson = async (type, chart) => {
    let response = await fetch(
      `/api/v2/familyCharts/getChartsWithSeongdoId?id=${newPerson._id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    )

    if (response.ok) {
      const result = await response.json()

      if (result?.charts?.charts?.length > 0) {
        return toast.error("이미 다른 가족에 추가된 성도입니다.")
      }
    }

    if (type == "spouse") {
      await addSpouse(chart)
    } else if (type == "father") {
      await addFather(chart)
    } else if (type == "mother") {
      await addMother(chart)
    } else if (type == "child") {
      await addChild(chart)
    }

    await fetch(`/api/v2/familyCharts/updateChart`, {
      method: "put",
      body: JSON.stringify({
        id: chartId,
        charts: charts.map((chart) => {
          return { id: chart.id, rels: chart.rels }
        }),
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    invalidateAll()
    searchName = ""
  }
  const preAddPerson = async (type, chart) => {
    addType = type
    newChart = chart

    if (!searchName) {
      return toast.error("이름을 입력해주세요.")
    }

    if (charts.map((chart) => chart.data["이름"]).includes(searchName)) {
      return toast.error("이미 가족에 추가되어있습니다.")
    }

    const result = await searchSeongdosByName()
    searchSeongdos = result.seongdos
    seongdoPage = result.page

    if (searchSeongdos?.length < 1) {
      return toast.error("일치하는 성도 정보가 없습니다.")
    }

    isModalHidden = false
  }

  const deletePerson = async (chart) => {
    if (
      (chart.rels.father || chart.rels.mother) &&
      (chart.rels.spouses.length > 0 || chart.rels.children.length > 0)
    ) {
      return toast.error("삭제할 수 없습니다.")
    }
    if (chart.rels.father) {
      charts.filter((item) => item.id == chart.rels.father)[0].rels.children =
        charts
          .filter((item) => item.id == chart.rels.father)[0]
          .rels.children.filter((id) => id != chart.id)
    }

    if (chart.rels.mother) {
      charts.filter((item) => item.id == chart.rels.mother)[0].rels.children =
        charts
          .filter((item) => item.id == chart.rels.mother)[0]
          .rels.children.filter((id) => id != chart.id)
    }

    if (chart.rels.spouses.length > 0) {
      charts.filter(
        (item) => item.id == chart.rels.spouses[0]
      )[0].rels.spouses = []
    }

    if (chart.rels.children.length > 0) {
      chart.rels.children.map((child) => {
        if (
          charts.filter((item) => item.id == child)[0].rels.father == chart.id
        ) {
          charts.filter((item) => item.id == child)[0].rels.father = undefined
        } else {
          charts.filter((item) => item.id == child)[0].rels.mother = undefined
        }
      })
    }

    charts = charts.filter((item) => item.id != chart.id)

    await fetch(`/api/v2/familyCharts/updateChart`, {
      method: "put",
      body: JSON.stringify({
        id: chartId,
        charts: charts.map((chart) => {
          return { id: chart.id, rels: chart.rels }
        }),
      }),
      headers: {
        "content-type": "application/json",
      },
    })
  }

  const searchSeongdo = async () => {
    let response = await fetch(`/api/seongdos/${searchName}`, {
      headers: {
        "content-type": "application/json",
      },
    })
    const result = await response.json()
    newPerson = result.seongdo
  }

  const searchSeongdosByName = async () => {
    let response = await fetch(
      `/api/seongdos?name=${searchName}&includeStu=true`,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    const result = await response.json()

    return { seongdos: result.seongdos, page: result.page }
  }

  const getChartsWithSeongdoId = async () => {
    let response = await fetch(
      `/api/v2/familyCharts/getChartsWithSeongdoId?id=${seongdo._id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    )

    if (response.ok) {
      const result = await response.json()
      charts = getFamilyChartFromDb(result.charts).charts
    }
  }

  onMount(async () => {
    if (charts) {
      create(charts)
    }
  })
  function create(data) {
    f3Chart = f3
      .createChart("#FamilyChart", data)
      .setTransitionTime(1000)
      .setCardXSpacing(250)
      .setCardYSpacing(150)
      .setOrientationVertical()
      .setSingleParentEmptyCard(false)

    f3Card = f3Chart
      .setCard(f3.CardHtml)
      .setCardDisplay(["이름", "생년월일"])
      .setCardDim({})
      .setMiniTree(true)
      .setStyle("imageRect")
      .setOnHoverPathToMain()

    f3Chart.updateTree({ initial: true })
  }
</script>

<div
  id="content"
  class="flex flex-col px-6 sm:px-16 pb-16 flex w-full bg-white overflow-scroll z-100"
>
  <div class="flex flex-col mb-3">
    <div
      class=" bg-white pt-8 bg-white sticky top-0 flex w-full justify-between pb-2 items-center"
    >
      <p class="text-lg font-medium mr-1">{seongdo.name} 가족관계도</p>
      {#if !allowedGroup.includes("게스트")}
        <div class="rounded flex ml-auto gap-2">
          <button
            type="button"
            class="h-[2rem] max-h-[2rem] border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            class:hidden={isAdding ? false : true}
            on:click={async () => {
              await fetch(`/api/v2/familyCharts/updateChart`, {
                method: "put",
                body: JSON.stringify({
                  id: chartId,
                  charts: charts.map((chart) => {
                    return { id: chart.id, rels: chart.rels }
                  }),
                }),
                headers: {
                  "content-type": "application/json",
                },
              })

              return goto(
                seongdo.birth
                  ? `/seongdos/${seongdo.name}-${seongdo.birth}`
                  : `/seongdos/${seongdo.name}`
              )
            }}
          >
            <span class="flex items-center">
              <Close class="text-[#F46055]" />
              <p>닫기</p>
            </span>
          </button>

          <button
            class="h-[2rem] max-h-[2rem] flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem] bg-[#F46055]"
            class:hidden={isAdding ? true : false}
            on:click={async () => {
              if (!charts) {
                const response = await fetch(`/api/v2/familyCharts/addChart`, {
                  method: "POST",
                  body: JSON.stringify({
                    charts: [{ id: seongdo._id, rels: {} }],
                  }),
                  headers: {
                    "content-type": "application/json",
                  },
                })

                charts = await getChartsWithSeongdoId()
                invalidateAll()
              }

              isAdding = true
            }}
          >
            <Edit color="#ffffff" width="16px" />
            <span>수정</span>
          </button>
        </div>
      {/if}
    </div>

    {#if isAdding}
      <div id="FamilyChartAdd" class="flex flex-col mt-6 gap-6">
        {#if charts}
          {#each charts as chart, idx}
            <div
              class="flex items-center bg-gray-100 p-3 rounded-lg gap-6 overflow-x-scroll"
            >
              <button
                class="flex gap-2 h-full"
                on:focus={undefined}
                on:mouseleave={() => {
                  const up = document.getElementById(`orderUp${idx}`)
                  const down = document.getElementById(`orderDown${idx}`)
                  up?.classList.add("invisible")
                  down?.classList.add("invisible")
                }}
              >
                <Card
                  name={chart.data.이름}
                  avatar={chart.data.avatar}
                  birth={chart.data.생년월일}
                  gender={chart.data.gender}
                  deleteHandler={() => deletePerson(chart)}
                />
                <button
                  class="flex flex-col justify-around mr-10 h-full"
                  on:focus={undefined}
                >
                  <button
                    on:focus={undefined}
                    on:mouseover={() => {
                      const up = document.getElementById(`orderUp${idx}`)
                      const down = document.getElementById(`orderDown${idx}`)
                      up?.classList.remove("invisible")
                      down?.classList.remove("invisible")
                    }}
                    on:click={() => {
                      if (idx > 0) {
                        let tempCharts = [...charts]

                        tempCharts.splice(
                          idx - 1,
                          2,
                          tempCharts[idx],
                          tempCharts[idx - 1]
                        )
                        charts = [...tempCharts]
                      }
                    }}
                    class="rounded-full hover:bg-gray-300 p-[3px]"
                  >
                    <ArrowUp
                      id={`orderUp${idx}`}
                      class="invisible text-lg text-gray-500 font-bold"
                    />
                  </button>
                  <button
                    on:focus={undefined}
                    on:mouseover={() => {
                      const up = document.getElementById(`orderUp${idx}`)
                      const down = document.getElementById(`orderDown${idx}`)
                      up?.classList.remove("invisible")
                      down?.classList.remove("invisible")
                    }}
                    on:click={() => {
                      if (idx + 1 < charts.length) {
                        let tempCharts = [...charts]

                        tempCharts.splice(
                          idx,
                          2,
                          tempCharts[idx + 1],
                          tempCharts[idx]
                        )
                        charts = [...tempCharts]
                      }
                    }}
                    class="rounded-full hover:bg-gray-300 p-[3px]"
                  >
                    <ArrowDown
                      id={`orderDown${idx}`}
                      class="invisible text-lg text-gray-500 font-bold"
                    />
                  </button>
                </button>
              </button>

              {#if chart.rels.spouses?.length == 0}
                {#if chart.data.gender == "M"}
                  <AddSpouse
                    onClick={() => {
                      preAddPerson("spouse", chart)
                    }}
                    bind:value={searchName}
                  />
                {:else}
                  <AddSpouse
                    color="#6cb8de"
                    onClick={() => {
                      preAddPerson("spouse", chart)
                    }}
                    bind:value={searchName}
                  />
                {/if}
              {/if}

              {#if !chart.rels.father}
                <AddFather
                  onClick={() => {
                    preAddPerson("father", chart)
                  }}
                  bind:value={searchName}
                />
              {/if}

              {#if !chart.rels.mother}
                <AddMother
                  onClick={() => {
                    preAddPerson("mother", chart)
                  }}
                  bind:value={searchName}
                />
              {/if}
              <AddSon
                onClick={() => {
                  preAddPerson("child", chart)
                }}
                bind:value={searchName}
              />
              <AddDaughter
                onClick={() => {
                  preAddPerson("child", chart)
                }}
                bind:value={searchName}
              />
            </div>
          {/each}
        {/if}
      </div>
    {:else if charts}
      <div id="FamilyChartParent">
        <div id="FamilyChart" class="f3 h-[calc(80vh)]"></div>
      </div>
    {/if}
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
          {#if searchSeongdos.length > 0}
            <div class={"flex text-sm border-l mb-7 overflow-scroll"}>
              <div
                class="flex flex-col whitespace-nowrap border-r divide-y border-b"
              >
                <div
                  id="nameField"
                  class=" flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
                >
                  이름
                </div>

                {#each searchSeongdos as item, index}
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
                  class=" flex justify-between px-3 font-bold items-center h-10 bg-[#D9D9D8]"
                >
                  생년월일
                </button>

                {#each searchSeongdos as item, index}
                  <div class="flex px-3 items-center h-10">
                    {item.birth}
                  </div>
                {/each}
              </div>
              <div
                class="flex flex-col flex-auto whitespace-nowrap divide-y border-b"
              >
                <button
                  class="flex gap-2 px-3 bg-[#D9D9D8] font-bold items-center w-full text-center h-10"
                >
                  직분
                </button>
                {#each searchSeongdos as item}
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
                {#each searchSeongdos as item, index}
                  <div class="flex items-center px-3 h-10">
                    <button
                      type="button"
                      class="flex items-center gap-1 rounded-sm text-white text-xs px-2 py-[0.4rem]"
                      on:click={async () => {
                        newPerson = item
                        await postAddPerson(addType, newChart)
                        isModalHidden = !isModalHidden
                        searchSeongdos = []
                        searchName = ""
                        addType = ""
                        newChart = {}
                      }}
                    >
                      <AddLarge fill="#4a4a4a" size={20} />
                    </button>
                  </div>
                {/each}
              </div>
            </div>

            {#if pagination.length > 0}
              <!-- content here -->

              <div class={"w-fit mx-auto flex items-center mb-5"}>
                <button
                  on:click={async () => {
                    const arrayStart = pagination[0]
                    if (arrayStart == 1) {
                      if (now != 1) {
                        await searchHandler(1)
                      }
                    } else {
                      await searchHandler(arrayStart - 1)
                    }
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
                {#each pagination as item}
                  <button
                    class="px-4 py-2 border-t border-b border-r text-base text-gray-600"
                    class:bg-gray-100={item == now}
                    class:bg-white={item != now}
                    on:click={async () => {
                      // searchSeongdos = await searchHandler(item)
                      await searchHandler(item)
                    }}
                  >
                    {item}
                  </button>
                {/each}

                <button
                  on:click={async () => {
                    const arrayEnd = pagination.slice(-1)[0]
                    const next = arrayEnd < last ? arrayEnd + 1 : arrayEnd

                    if (now != last) {
                      // searchSeongdos = await searchHandler(next)
                      await searchHandler(next)
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
              </div>
            {/if}
          {/if}
        </div>

        <div class="bg-gray-50 h-[55px] px-4 py-3 flex flex-row-reverse px-6">
          <button
            type="button"
            class="border-gray-300 border flex items-center gap-1 rounded-sm text-xs px-2 py-[0.4rem]"
            on:click={async () => {
              isModalHidden = !isModalHidden
              searchSeongdos = []
              searchName = ""
              addType = ""
              newChart = {}
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
