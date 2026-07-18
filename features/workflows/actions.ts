"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { tasks } from "@trigger.dev/sdk"

import { createWorkflow } from "@/features/workflows/data"
// Type-only import so the task code is never bundled into the server action.
import type { helloWorld } from "@/trigger/example"

// Server actions for workflows. 
export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const workflow = await createWorkflow(orgId, name)

  // Refresh the dashboard layout so the sidebar picks up the new workflow.
  revalidatePath("/workflows", "layout")
  redirect(`/workflows/${workflow.id}`)
}


// Server action to run a workflow. 
export async function runWorkflowAction(workflowId: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  // Trigger by id with a type-only handle for full payload type-safety.
  const handle = await tasks.trigger<typeof helloWorld>("hello-world", {
    message: `Run workflow ${workflowId}`,
  })

  // `publicAccessToken` is scoped to this run — the frontend uses it to
  // subscribe to realtime updates via useRealtimeRun.
  return { runId: handle.id, publicAccessToken: handle.publicAccessToken }
}
