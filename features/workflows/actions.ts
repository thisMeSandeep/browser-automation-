"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createWorkflow } from "@/features/workflows/data"

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const workflow = await createWorkflow(orgId, name)

  // Refresh the dashboard layout so the sidebar picks up the new workflow.
  revalidatePath("/workflows", "layout")

  // `redirect` throws NEXT_REDIRECT, so keep it outside any try/catch.
  redirect(`/workflows/${workflow.id}`)
}
