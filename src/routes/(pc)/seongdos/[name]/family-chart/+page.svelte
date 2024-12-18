<script lang="ts">
  import { onMount } from "svelte"
  import "./family-chart.css"

  export let data: {
    seongdoId: string
    charts: any
  }

  $: seongdoId = data.seongdoId
  $: charts = data.charts

  onMount(async () => {
    if (charts) {
      create(charts)
    }

    function create(data) {
      const f3Chart = f3
        .createChart("#FamilyChart", data)
        .setTransitionTime(1000)
        .setCardXSpacing(250)
        .setCardYSpacing(150)
        .setOrientationVertical()
        .setSingleParentEmptyCard(false)

      const f3Card = f3Chart
        .setCard(f3.CardHtml)
        .setCardDisplay(["이름", "생년월일"])
        .setCardDim({})
        .setMiniTree(true)
        .setStyle("imageRect")
        .setOnHoverPathToMain()

      const f3EditTree = f3Chart
        .editTree({ addRelativeInstance: { onCancel: console.log("test") } })
        .fixed(true)
        .setFields(["이름", "생년월일"])
        .setOnChange(() => {
          // console.log("here", f3EditTree.getDataJson())
        })

      console.log(f3EditTree)

      f3Card.setOnCardClick((e, d) => {
        f3EditTree.open(d)
        if (f3EditTree.isAddingRelative()) return
        f3Card.onCardClickDefault(e, d)
      })

      // f3EditTree.addRelativeInstance.cancelCallback = () => {
      //   console.log("test")
      // }

      f3Chart.updateTree({ initial: true })
      f3EditTree.open(f3Chart.getMainDatum())
      f3EditTree.closeForm()

      f3Chart.updateTree({ initial: true })
    }
  })
</script>

<div id="content" class="flex flex-col w-full bg-white overflow-scroll">
  <div class="flex flex-col w-full-if-mobile mb-3">
    <div id="FamilyChart" class="f3 w-[calc(175%)] h-[calc(100vh)]"></div>
  </div>
</div>
