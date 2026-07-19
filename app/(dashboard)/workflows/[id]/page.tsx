import { ReactFlowProvider } from "@xyflow/react"

import { Room } from "@/features/workflows/components/room"
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { getWorkflow } from "@/features/workflows/data"
import { liveblocks } from "@/lib/liveblocks"

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { orgId } = await auth()
  if (!orgId) {
    notFound()
  }

  const workflow = await getWorkflow(orgId, id)
  if (!workflow) {
    notFound()
  }

  // Ensure the room exists and grant write access to the workflow's org. Private
  // by default so only members of this org (via their orgId group) can join.
  await liveblocks.getOrCreateRoom(id, {
    defaultAccesses: [],
    groupsAccesses: {
      [orgId]: ["room:write"],
    },
    metadata: {
      title: workflow.name,
    },
  })

  return (
    <Room roomId={id}>
      {/* One React Flow store above both the canvas and the palette sidebar, so
          the sidebar can read nodes and add to the same graph the canvas renders. */}
      <ReactFlowProvider>
        <WorkflowShell workflowId={id} />
      </ReactFlowProvider>
    </Room>
  )
}
