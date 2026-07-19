"use client"

import { useCallback, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import {
  addEdge,
  Background,
  ConnectionLineType,
  Controls,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type ColorMode,
  type Connection,
  type Edge,
} from "@xyflow/react"


import {StepNode} from "./step-node"
import type { StepNodeType } from "../nodes/node-registry"


import "@xyflow/react/dist/style.css"


const nodeTypes: NodeTypes = { step: StepNode }

const initialNodes: StepNodeType[] = [
  {
    id: "start",
    type: "step",
    position: { x: 0, y: 0 },
    data: { type: "start", kind: "trigger", title: "Start", values: {} },
  },
]

const initialEdges: Edge[] = []



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
    ? ((resolvedTheme as ColorMode) ?? "light")
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
        nodeTypes={nodeTypes}
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
