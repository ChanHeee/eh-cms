<script lang="ts">
  import AddDaughter from "./components/AddDaughter.svelte"
  import AddSon from "./components/AddSon.svelte"
  import AddMother from "./components/AddMother.svelte"
  import AddFather from "./components/AddFather.svelte"
  import AddSpouse from "./components/AddSpouse.svelte"
  import Card from "./components/Card.svelte"
  import { onMount } from "svelte"
  import "./family-chart.css"
  import { Close, Edit, ArrowUp, ArrowDown } from "carbon-icons-svelte"
  import toast from "svelte-french-toast"
  import { getFamilyChartFromDb } from "$lib/utils"
  import { goto, invalidateAll } from "$app/navigation"

  export let data: {
    seongdo: any
    charts: any
  }

  $: seongdo = data.seongdo
  $: charts = data.charts.charts
  $: chartId = data.charts._id
  $: newPerson = null
  $: searchName = ""
  $: isAdding = false

  $: f3Chart = null
  $: f3Card = null

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

  const addPerson = async (type, chart) => {
    if (!searchName) {
      return toast.error("이름을 입력해주세요.")
    }
    if (charts.map((chart) => chart.data["이름"]).includes(searchName)) {
      return toast.error("이미 가족에 추가되어있습니다.")
    }

    await searchSeongdo()

    if (!newPerson) {
      return toast.error("일치하는 성도 정보가 없습니다.")
    }

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

            return goto(`/seongdos/${seongdo.name}`)
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
                      addPerson("spouse", chart)
                    }}
                    bind:value={searchName}
                  />
                {:else}
                  <AddSpouse
                    color="#789fac"
                    onClick={() => {
                      addPerson("spouse", chart)
                    }}
                    bind:value={searchName}
                  />
                {/if}
              {/if}

              {#if !chart.rels.father}
                <AddFather
                  onClick={() => {
                    addPerson("father", chart)
                  }}
                  bind:value={searchName}
                />
              {/if}

              {#if !chart.rels.mother}
                <AddMother
                  onClick={() => {
                    addPerson("mother", chart)
                  }}
                  bind:value={searchName}
                />
              {/if}
              <AddSon
                onClick={() => {
                  addPerson("child", chart)
                }}
                bind:value={searchName}
              />
              <AddDaughter
                onClick={() => {
                  addPerson("child", chart)
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
