"use client"

import { useCallback, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import {
  addEdge,
  Background,
  ConnectionLineType,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type ColorMode,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

const initialNodes: Node[] = [
  {
    id: "n1",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
  },
  {
    id: "n2",
    position: { x: 160, y: 120 },
    data: { label: "Step" },
  },
  {
    id: "n3",
    type: "output",
    position: { x: 0, y: 240 },
    data: { label: "End" },
  },
]

const initialEdges: Edge[] = [
  { id: "n1-n2", source: "n1", target: "n2" },
  { id: "n2-n3", source: "n2", target: "n3" },
]

const emptySubscribe = () => () => {}


function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

// Canvas panel for the workflow editor, where the graph is edited.
export function Canvas() {
  const mounted = useMounted()
  const { resolvedTheme } = useTheme()


  const colorMode: ColorMode = mounted
    ? (resolvedTheme as ColorMode) ?? "light"
    : "light"

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={colorMode}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: "var(--border)" }}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "var(--border)" },
        }}
        style={
          {
            "--xy-background-color": "var(--background)",
            "--xy-edge-stroke-width": 2,
            "--xy-connectionline-stroke-width": 2,
          } as React.CSSProperties
        }
        maxZoom={1}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
