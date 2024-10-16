<script lang="ts">
  import { writable } from "svelte/store"
  import {
    SvelteFlow,
    Background,
    Controls,
    MiniMap,
    Position,
    type Node,
    type Edge,
  } from "@xyflow/svelte"
  import CircleNode from "./familyTree/CircleNode.svelte"
  import FamilyNode from "./familyTree/FamilyNode.svelte"

  const nodeTypes = {
    circle: CircleNode,
    family: FamilyNode,
  }

  const edgeType = "step"
  const nodeWith = 50

  const bgColor = writable("#1A192B")

  export const initialNodes: Node[] = [
    {
      id: "1",
      type: "family",
      width: 50,
      data: { label: "본인", source: [Position.Right] },
      position: { x: 0, y: 0 },
      draggable: false,
    },
    {
      id: "2",
      type: "family",
      width: 50,
      height: 40,
      data: { label: "아내", target: [Position.Left] },
      position: { x: 80, y: 0 },
      draggable: false,
    },
    {
      id: "3",
      type: "circle",
      data: { label: "", source: [Position.Right], target: [Position.Right] },
      position: { x: 0, y: 0 },
      draggable: false,
    },
    {
      id: "4",
      type: "family",
      width: 50,
      height: 40,
      data: { label: "딸", target: [Position.Top] },
      position: { x: 80, y: 100 },
      draggable: false,
    },
  ]

  export const initialEdges: Edge[] = [
    { id: "e1-3", source: "1", target: "3", type: "straight" },
    { id: "e3-2", source: "3", target: "2", type: "straight" },
    { id: "e3-4", source: "3", target: "4", type: edgeType },
  ]

  const nodes = writable<Node[]>(initialNodes)
  const edges = writable<Edge[]>(initialEdges)
</script>

<main class="h-full">
  <SvelteFlow {nodes} {edges} {nodeTypes} fitView minZoom={0.1} maxZoom={2.5}>
    <Background />
    <Controls position="top-left" />
  </SvelteFlow>
</main>
